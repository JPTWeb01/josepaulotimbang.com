<?php

namespace App\Libraries;

use Firebase\JWT\JWT;
use RuntimeException;

/**
 * Minimal read-only Google API client using a service account key file.
 * Used for the admin "Analytics & SEO" tab (GA4 Data API + Search Console API).
 *
 * The key file lives outside the web root, by default at
 * writable/google/service-account.json (override with GOOGLE_CREDENTIALS_FILE).
 * Errors are thrown as RuntimeException with the HTTP status as the code.
 */
class GoogleApi
{
    private const TOKEN_URL = 'https://oauth2.googleapis.com/token';
    private const SCOPES    = 'https://www.googleapis.com/auth/analytics.readonly '
                            . 'https://www.googleapis.com/auth/webmasters.readonly';

    public static function credentialsFile(): string
    {
        $file = trim((string) env('GOOGLE_CREDENTIALS_FILE', ''));
        if ($file === '') {
            return WRITEPATH . 'google/service-account.json';
        }

        return str_starts_with($file, '/') ? $file : ROOTPATH . $file;
    }

    public static function hasCredentials(): bool
    {
        return is_file(self::credentialsFile());
    }

    /** The service account's email (to show in setup hints), or null. */
    public static function clientEmail(): ?string
    {
        $sa = self::serviceAccount(false);

        return $sa['client_email'] ?? null;
    }

    /** POST JSON to a Google API with the service account's access token. */
    public static function post(string $url, array $body): array
    {
        [$status, $data] = self::http($url, json_encode($body, JSON_UNESCAPED_SLASHES), [
            'Content-Type: application/json',
            'Authorization: Bearer ' . self::token(),
        ]);

        if ($status !== 200) {
            $msg = $data['error']['message'] ?? ('HTTP ' . $status);
            log_message('warning', 'Google API {url} failed ({status}): {msg}', [
                'url' => strtok($url, '?'), 'status' => $status, 'msg' => substr((string) $msg, 0, 300),
            ]);

            throw new RuntimeException((string) $msg, $status);
        }

        return $data;
    }

    private static function token(): string
    {
        $cached = cache('google_access_token');
        if (is_string($cached) && $cached !== '') {
            return $cached;
        }

        $sa  = self::serviceAccount(true);
        $now = time();
        $jwt = JWT::encode([
            'iss'   => $sa['client_email'],
            'scope' => self::SCOPES,
            'aud'   => self::TOKEN_URL,
            'iat'   => $now,
            'exp'   => $now + 3600,
        ], $sa['private_key'], 'RS256');

        [$status, $data] = self::http(self::TOKEN_URL, http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion'  => $jwt,
        ]), ['Content-Type: application/x-www-form-urlencoded']);

        if ($status !== 200 || empty($data['access_token'])) {
            $msg = $data['error_description'] ?? $data['error'] ?? ('HTTP ' . $status);

            throw new RuntimeException('Google sign-in for the service account failed: ' . $msg, 401);
        }

        cache()->save('google_access_token', $data['access_token'], max(60, (int) ($data['expires_in'] ?? 3600) - 300));

        return $data['access_token'];
    }

    private static function serviceAccount(bool $required): ?array
    {
        $raw = @file_get_contents(self::credentialsFile());
        $sa  = $raw === false ? null : json_decode($raw, true);

        if (! is_array($sa) || empty($sa['client_email']) || empty($sa['private_key'])) {
            if ($required) {
                throw new RuntimeException('The Google service account key file is missing or is not a valid JSON key.', 500);
            }

            return null;
        }

        return $sa;
    }

    /** @return array{0:int,1:array} */
    private static function http(string $url, string $body, array $headers): array
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $body,
            CURLOPT_HTTPHEADER     => array_merge(['Accept: application/json'], $headers),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT        => 25,
        ]);
        $raw    = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $err    = curl_error($ch);

        if ($raw === false) {
            throw new RuntimeException('Could not reach Google: ' . $err, 502);
        }

        $data = json_decode((string) $raw, true);

        return [$status, is_array($data) ? $data : []];
    }
}

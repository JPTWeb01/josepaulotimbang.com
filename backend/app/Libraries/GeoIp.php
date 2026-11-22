<?php

namespace App\Libraries;

use MaxMind\Db\Reader;
use Throwable;

/**
 * Offline IP → country lookup using the free DB-IP "IP to Country Lite"
 * database (CC BY 4.0, https://db-ip.com). The deploy workflow downloads
 * the monthly file to writable/geoip/dbip-country-lite.mmdb.
 */
class GeoIp
{
    private static ?Reader $reader = null;

    public static function country(string $ip): ?string
    {
        if (! filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
            return null;
        }

        try {
            if (self::$reader === null) {
                $file = WRITEPATH . 'geoip/dbip-country-lite.mmdb';
                if (! is_file($file)) {
                    return null;
                }
                self::$reader = new Reader($file);
            }
            $code = self::$reader->get($ip)['country']['iso_code'] ?? null;

            return is_string($code) && strlen($code) === 2 ? strtoupper($code) : null;
        } catch (Throwable $e) {
            log_message('warning', 'GeoIP lookup failed: {msg}', ['msg' => $e->getMessage()]);

            return null;
        }
    }
}

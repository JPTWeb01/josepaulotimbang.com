<?php

namespace App\Controllers\Api;

use App\Libraries\GoogleApi;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;
use RuntimeException;
use Throwable;

/**
 * Admin "Analytics & SEO" tab: Google Analytics 4 (visitors) + Google Search
 * Console (search clicks, impressions, queries) + numbers from our own data.
 *
 * .env:
 *   GA_PROPERTY_ID       numeric GA4 property ID (GA4 > Admin > Property details)
 *   SEARCH_CONSOLE_SITE  "sc-domain:josepaulotimbang.com" or "https://josepaulotimbang.com/"
 * plus the service account key file (see App\Libraries\GoogleApi).
 * Google results are cached for 10 minutes (live visitors: 1 minute).
 */
class AnalyticsController extends ResourceController
{
    private const CACHE_SECONDS = 600;

    // Custom events sent by the website (frontend/lib/analytics.ts)
    private const EVENTS = [
        'resume_download' => 'Resume downloads',
        'contact_submit'  => 'Contact forms sent',
        'contact_email'   => 'Email link clicks',
        'click_linkedin'  => 'LinkedIn clicks',
        'click_github'    => 'GitHub clicks',
        'chat_open'       => 'Chatbot opened',
        'chat_message'    => 'Chat messages sent',
        'click_outbound'  => 'Other outbound clicks',
    ];

    public function __construct()
    {
        helper('response');
    }

    // GET /v1/admin/analytics?days=28[&refresh=1]
    public function index(): ResponseInterface
    {
        $days    = max(1, min(365, (int) ($this->request->getGet('days') ?: 28)));
        $refresh = $this->request->getGet('refresh') === '1';

        $hasKey = GoogleApi::hasCredentials();
        $out    = [
            'days'            => $days,
            'service_account' => $hasKey ? GoogleApi::clientEmail() : null,
            'ga_configured'   => $hasKey && $this->propertyId() !== '',
            'sc_configured'   => $hasKey && $this->scSite() !== '',
            'ga'              => null,
            'ga_error'        => null,
            'sc'              => null,
            'sc_error'        => null,
            'site'            => $this->siteStats($days),
        ];

        if ($out['ga_configured']) {
            try {
                $out['ga'] = $this->cached("analytics_ga_{$days}", $refresh, fn () => $this->gaDashboard($days));
            } catch (Throwable $e) {
                $out['ga_error'] = $this->explain($e, 'ga');
            }
        }

        if ($out['sc_configured']) {
            try {
                $out['sc'] = $this->cached("analytics_sc_{$days}", $refresh, fn () => $this->scDashboard($days));
            } catch (Throwable $e) {
                $out['sc_error'] = $this->explain($e, 'sc');
            }
        }

        return api_success($out);
    }

    // GET /v1/admin/analytics/realtime
    public function realtime(): ResponseInterface
    {
        if (! GoogleApi::hasCredentials() || $this->propertyId() === '') {
            return api_success(['active_users' => null]);
        }

        try {
            $n = cache('analytics_rt');
            if (! is_int($n)) {
                $rep = GoogleApi::post($this->gaUrl('runRealtimeReport'), ['metrics' => [['name' => 'activeUsers']]]);
                $n   = (int) ($rep['rows'][0]['metricValues'][0]['value'] ?? 0);
                cache()->save('analytics_rt', $n, 60);
            }

            return api_success(['active_users' => $n]);
        } catch (Throwable $e) {
            return api_success(['active_users' => null]);
        }
    }

    // ─── Google Analytics 4 ─────────────────────────────────────────

    private function gaDashboard(int $days): array
    {
        $range  = [['startDate' => ($days - 1) . 'daysAgo', 'endDate' => 'today']];
        $totalM = ['activeUsers', 'newUsers', 'sessions', 'screenPageViews', 'averageSessionDuration', 'engagementRate'];

        $specs = [
            'totals'   => [[], $totalM, []],
            'daily'    => [['date'], ['activeUsers', 'screenPageViews'], ['orderBys' => [['dimension' => ['dimensionName' => 'date']]]]],
            'pages'    => [['pagePath'], ['screenPageViews', 'activeUsers'], $this->top('screenPageViews', 15)],
            'channels' => [['sessionDefaultChannelGroup'], ['sessions'], $this->top('sessions', 10)],
            'sources'  => [['sessionSource'], ['sessions'], $this->top('sessions', 10)],
            'countries' => [['country'], ['activeUsers'], $this->top('activeUsers', 10)],
            'cities'   => [['city'], ['activeUsers'], $this->top('activeUsers', 10)],
            'devices'  => [['deviceCategory'], ['activeUsers'], $this->top('activeUsers', 5)],
            'events'   => [['eventName'], ['eventCount'], ['dimensionFilter' => ['filter' => [
                'fieldName'    => 'eventName',
                'inListFilter' => ['values' => array_keys(self::EVENTS)],
            ]]]],
        ];

        $requests = [];
        foreach ($specs as [$dims, $mets, $opts]) {
            $requests[] = array_merge([
                'dateRanges' => $range,
                'dimensions' => array_map(static fn ($d) => ['name' => $d], $dims),
                'metrics'    => array_map(static fn ($m) => ['name' => $m], $mets),
            ], $opts);
        }

        // batchRunReports takes at most 5 requests per call
        $reports = [];
        foreach (array_chunk($requests, 5) as $chunk) {
            $res     = GoogleApi::post($this->gaUrl('batchRunReports'), ['requests' => $chunk]);
            $reports = array_merge($reports, $res['reports'] ?? []);
        }

        $r = [];
        foreach (array_keys($specs) as $i => $name) {
            [$dims, $mets] = $specs[$name];
            $r[$name] = $this->gaRows($reports[$i] ?? [], $dims, $mets);
        }

        foreach ($r['daily'] as &$row) {
            $d           = $row['date'];
            $row['date'] = substr($d, 0, 4) . '-' . substr($d, 4, 2) . '-' . substr($d, 6, 2);
        }
        unset($row);

        $counts = array_column($r['events'], 'eventCount', 'eventName');
        $events = [];
        foreach (self::EVENTS as $name => $label) {
            $events[] = ['name' => $name, 'label' => $label, 'count' => (int) ($counts[$name] ?? 0)];
        }

        return [
            'totals'       => $r['totals'][0] ?? array_fill_keys($totalM, 0),
            'daily'        => $r['daily'],
            'pages'        => $r['pages'],
            'channels'     => $r['channels'],
            'sources'      => $r['sources'],
            'countries'    => $r['countries'],
            'cities'       => $r['cities'],
            'devices'      => $r['devices'],
            'events'       => $events,
            'generated_at' => gmdate('c'),
        ];
    }

    private function top(string $metric, int $limit): array
    {
        return ['limit' => $limit, 'orderBys' => [['metric' => ['metricName' => $metric], 'desc' => true]]];
    }

    private function gaRows(array $report, array $dims, array $mets): array
    {
        $out = [];
        foreach ($report['rows'] ?? [] as $row) {
            $item = [];
            foreach ($dims as $i => $d) {
                $item[$d] = $row['dimensionValues'][$i]['value'] ?? '';
            }
            foreach ($mets as $i => $m) {
                $v        = (string) ($row['metricValues'][$i]['value'] ?? '0');
                $item[$m] = str_contains($v, '.') ? (float) $v : (int) $v;
            }
            $out[] = $item;
        }

        return $out;
    }

    private function propertyId(): string
    {
        $id = trim((string) env('GA_PROPERTY_ID', ''));

        return preg_replace('~^properties/~', '', $id);
    }

    private function gaUrl(string $method): string
    {
        return 'https://analyticsdata.googleapis.com/v1beta/properties/' . rawurlencode($this->propertyId()) . ':' . $method;
    }

    // ─── Google Search Console ──────────────────────────────────────

    private function scDashboard(int $days): array
    {
        $url   = 'https://searchconsole.googleapis.com/webmasters/v3/sites/' . rawurlencode($this->scSite()) . '/searchAnalytics/query';
        $base  = [
            'startDate' => gmdate('Y-m-d', time() - ($days - 1) * DAY),
            'endDate'   => gmdate('Y-m-d'),
            'dataState' => 'all', // include the most recent (not yet final) days
        ];
        $query = static fn (array $dims, int $limit = 25) => GoogleApi::post($url, $base + ['dimensions' => $dims, 'rowLimit' => $limit])['rows'] ?? [];

        $map = static function (array $rows, ?string $key): array {
            return array_map(static fn ($r) => ($key ? [$key => $r['keys'][0] ?? ''] : []) + [
                'clicks'      => (int) ($r['clicks'] ?? 0),
                'impressions' => (int) ($r['impressions'] ?? 0),
                'ctr'         => round((float) ($r['ctr'] ?? 0), 4),
                'position'    => round((float) ($r['position'] ?? 0), 1),
            ], $rows);
        };

        $totals = $map($query([], 1), null)[0] ?? ['clicks' => 0, 'impressions' => 0, 'ctr' => 0, 'position' => 0];

        return [
            'site'         => $this->scSite(),
            'totals'       => $totals,
            'daily'        => $map($query(['date'], 500), 'date'),
            'queries'      => $map($query(['query'], 25), 'query'),
            'pages'        => $map($query(['page'], 15), 'page'),
            'countries'    => $map($query(['country'], 10), 'country'),
            'devices'      => $map($query(['device'], 5), 'device'),
            'generated_at' => gmdate('c'),
        ];
    }

    private function scSite(): string
    {
        return trim((string) env('SEARCH_CONSOLE_SITE', ''));
    }

    // ─── Our own data ───────────────────────────────────────────────

    private function siteStats(int $days): array
    {
        $since = gmdate('Y-m-d H:i:s', time() - $days * DAY);
        $chat  = ['messages' => null, 'visitors' => null];

        try {
            $row  = db_connect()->table('chat_logs')
                ->select('COUNT(*) AS messages, COUNT(DISTINCT ip) AS visitors')
                ->where('created_at >=', $since)
                ->get()->getRowArray();
            $chat = ['messages' => (int) ($row['messages'] ?? 0), 'visitors' => (int) ($row['visitors'] ?? 0)];
        } catch (Throwable $e) {
            log_message('error', 'Analytics site stats: {msg}', ['msg' => $e->getMessage()]);
        }

        $raw     = @file_get_contents(WRITEPATH . 'jobs/matches.json');
        $matches = $raw === false ? [] : (json_decode($raw, true)['items'] ?? []);
        $rawSt   = @file_get_contents(WRITEPATH . 'jobs/status.json');
        $status  = $rawSt === false ? [] : (json_decode($rawSt, true) ?: []);

        return [
            'chat_messages' => $chat['messages'],
            'chat_visitors' => $chat['visitors'],
            'job_matches'   => is_array($matches) ? count($matches) : 0,
            'jobs_applied'  => count(array_filter($status, static fn ($s) => $s === 'applied')),
        ];
    }

    // ─── Helpers ────────────────────────────────────────────────────

    private function cached(string $key, bool $refresh, callable $fn): array
    {
        if (! $refresh) {
            $hit = cache($key);
            if (is_array($hit)) {
                return $hit;
            }
        }
        $value = $fn();
        cache()->save($key, $value, self::CACHE_SECONDS);

        return $value;
    }

    /** Turn Google's errors into a next step the site owner can act on. */
    private function explain(Throwable $e, string $which): string
    {
        $email = GoogleApi::clientEmail() ?? 'the service account';
        $code  = $e instanceof RuntimeException ? $e->getCode() : 0;
        $msg   = $e->getMessage();

        if (stripos($msg, 'has not been used') !== false || stripos($msg, 'is disabled') !== false) {
            return $which === 'ga'
                ? 'Turn on the "Google Analytics Data API" in Google Cloud for this service account\'s project, then wait a few minutes.'
                : 'Turn on the "Google Search Console API" in Google Cloud for this service account\'s project, then wait a few minutes.';
        }
        if ($code === 403 || $code === 404) {
            return $which === 'ga'
                ? "No access yet. In Google Analytics go to Admin > Property access management and add {$email} as a Viewer. Also check GA_PROPERTY_ID."
                : "No access yet. In Search Console go to Settings > Users and permissions and add {$email} (Restricted is enough). Also check SEARCH_CONSOLE_SITE.";
        }

        log_message('error', 'Analytics ({which}): {msg}', ['which' => $which, 'msg' => $msg]);

        return 'Google error: ' . substr($msg, 0, 200);
    }
}

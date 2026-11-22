<?php

namespace App\Controllers\Api;

use App\Libraries\GeoIp;
use App\Models\ChatLogModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class ChatLogController extends ResourceController
{
    private ChatLogModel $logs;

    public function __construct()
    {
        helper('response');
        $this->logs = new ChatLogModel();
    }

    // POST /v1/chat-logs  (X-Ingest-Key) — called by the chatbot server after each reply
    public function store(): ResponseInterface
    {
        $d = $this->request->getJSON(true) ?? [];

        $ip      = trim((string) ($d['ip'] ?? ''));
        $message = trim((string) ($d['message'] ?? ''));
        if ($message === '' || ! filter_var($ip, FILTER_VALIDATE_IP)) {
            return api_error('ip and message are required', 422);
        }

        $cut = static fn ($v, int $n) => ($v === null || $v === '') ? null : mb_substr(trim((string) $v), 0, $n);

        $this->logs->insert([
            'created_at' => gmdate('Y-m-d H:i:s'),
            'session_id' => $cut(preg_replace('/[^A-Za-z0-9_-]/', '', (string) ($d['session_id'] ?? '')), 40),
            'ip'         => $ip,
            'country'    => GeoIp::country($ip),
            'site'       => $cut($d['site'] ?? null, 120),
            'page'       => $cut($d['page'] ?? null, 255),
            'user_agent' => $cut($d['user_agent'] ?? null, 255),
            'message'    => mb_substr($message, 0, 4000),
            'reply'      => $cut($d['reply'] ?? null, 8000),
        ]);
        $this->logs->pruneDaily();

        return api_success(null, 'Logged', 201);
    }

    // GET /v1/admin/chats?from=&to=&country=&ip=&q=&session=&page=&per_page=
    public function index(): ResponseInterface
    {
        $f       = $this->request->getGet();
        $page    = max(1, (int) ($f['page'] ?? 1));
        $perPage = min(100, max(10, (int) ($f['per_page'] ?? 50)));

        $total = $this->logs->filtered($f)->countAllResults();
        $items = $this->logs->filtered($f)
            ->orderBy('created_at', 'DESC')->orderBy('id', 'DESC')
            ->findAll($perPage, ($page - 1) * $perPage);

        return api_paginated($items, $total, $page, $perPage);
    }

    // GET /v1/admin/chats/stats — same filters; summary numbers for the header cards
    public function stats(): ResponseInterface
    {
        $f  = $this->request->getGet();
        $db = $this->logs->db;

        $row = $this->logs->filtered($f)
            ->select('COUNT(*) AS messages, COUNT(DISTINCT ip) AS visitors, COUNT(DISTINCT session_id) AS conversations')
            ->get()->getRowArray();

        $countries = $this->logs->filtered($f)
            ->select('country, COUNT(*) AS messages, COUNT(DISTINCT ip) AS visitors')
            ->groupBy('country')->orderBy('messages', 'DESC')->limit(15)
            ->get()->getResultArray();

        $daily = $db->table('chat_logs')
            ->select('DATE(created_at) AS day, COUNT(*) AS messages')
            ->where('created_at >=', gmdate('Y-m-d 00:00:00', time() - 29 * DAY))
            ->groupBy('day')->orderBy('day')
            ->get()->getResultArray();

        return api_success([
            'messages'       => (int) ($row['messages'] ?? 0),
            'visitors'       => (int) ($row['visitors'] ?? 0),
            'conversations'  => (int) ($row['conversations'] ?? 0),
            'countries'      => $countries,
            'daily'          => $daily,
            'retention_days' => ChatLogModel::RETENTION_DAYS,
        ]);
    }

    // DELETE /v1/admin/chats/(:num)
    public function delete($id = null): ResponseInterface
    {
        $this->logs->delete((int) $id);

        return api_success(null, 'Deleted');
    }
}

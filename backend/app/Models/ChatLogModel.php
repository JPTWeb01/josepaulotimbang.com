<?php

namespace App\Models;

use CodeIgniter\Model;

class ChatLogModel extends Model
{
    protected $table         = 'chat_logs';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $useTimestamps = false;
    protected $allowedFields = [
        'created_at', 'session_id', 'ip', 'country', 'site', 'page', 'user_agent', 'message', 'reply',
    ];

    public const RETENTION_DAYS = 90;

    /** Delete logs older than the retention period (runs at most once a day). */
    public function pruneDaily(): void
    {
        $cache = cache();
        if ($cache->get('chat_logs_pruned')) {
            return;
        }
        $cutoff = gmdate('Y-m-d H:i:s', time() - self::RETENTION_DAYS * DAY);
        $this->where('created_at <', $cutoff)->delete();
        $cache->save('chat_logs_pruned', 1, DAY);
    }

    /**
     * Apply the dashboard filters. "from"/"to" are UTC datetimes
     * (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS); a bare "to" date is inclusive.
     *
     * @param array<string, mixed> $f
     */
    public function filtered(array $f): self
    {
        $dt = '/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/';

        if (! empty($f['from']) && preg_match($dt, (string) $f['from'])) {
            $this->where('created_at >=', strlen($f['from']) === 10 ? $f['from'] . ' 00:00:00' : $f['from']);
        }
        if (! empty($f['to']) && preg_match($dt, (string) $f['to'])) {
            $this->where('created_at <=', strlen($f['to']) === 10 ? $f['to'] . ' 23:59:59' : $f['to']);
        }
        if (! empty($f['country']) && preg_match('/^[A-Za-z]{2}$/', (string) $f['country'])) {
            $this->where('country', strtoupper($f['country']));
        }
        if (! empty($f['ip'])) {
            $this->like('ip', trim((string) $f['ip']), 'after');
        }
        if (! empty($f['session'])) {
            $this->where('session_id', (string) $f['session']);
        }
        if (! empty($f['q'])) {
            $this->groupStart()->like('message', (string) $f['q'])->orLike('reply', (string) $f['q'])->groupEnd();
        }

        return $this;
    }
}

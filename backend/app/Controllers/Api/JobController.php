<?php

namespace App\Controllers\Api;

use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

/**
 * Job finder results. The daily GitHub Action pushes its matches.json here
 * (including company research and interview prep for the top jobs), plus its
 * study guides and daily lesson; the admin dashboard reads them and can mark
 * jobs as applied / saved / hidden.
 * Stored as JSON files in writable/jobs (no database table needed).
 */
class JobController extends ResourceController
{
    private const STATUSES = ['new', 'saved', 'applied', 'hidden'];

    private string $dir;

    public function __construct()
    {
        helper('response');
        $this->dir = WRITEPATH . 'jobs/';
    }

    // POST /v1/jobs/import  (X-Ingest-Key) — body: the job finder's matches array
    public function import(): ResponseInterface
    {
        $jobs = $this->request->getJSON(true);
        if (! is_array($jobs) || ! array_is_list($jobs)) {
            return api_error('Expected a JSON array of jobs', 422);
        }
        $jobs = array_values(array_filter($jobs, static fn ($j) => is_array($j) && isset($j['id'], $j['title'], $j['url'])));

        $this->write('matches.json', ['updated_at' => gmdate('c'), 'items' => $jobs]);

        return api_success(['count' => count($jobs)], 'Imported', 201);
    }

    // POST /v1/jobs/learning  (X-Ingest-Key) — body: {lesson, gaps, guides, ...}
    public function importLearning(): ResponseInterface
    {
        $data = $this->request->getJSON(true);
        if (! is_array($data) || array_is_list($data) || ! isset($data['guides']) || ! is_array($data['guides'])) {
            return api_error('Expected a JSON object with a guides list', 422);
        }
        $data['updated_at'] = gmdate('c');
        $this->write('learning.json', $data);

        return api_success(['guides' => count($data['guides'])], 'Imported', 201);
    }

    // GET /v1/admin/learning
    public function learning(): ResponseInterface
    {
        return api_success($this->read('learning.json', ['updated_at' => null, 'guides' => []]));
    }

    // GET /v1/admin/jobs
    public function index(): ResponseInterface
    {
        $data   = $this->read('matches.json', ['updated_at' => null, 'items' => []]);
        $status = $this->read('status.json', []);

        foreach ($data['items'] as &$job) {
            $job['status'] = $status[$job['id']] ?? 'new';
        }

        return api_success($data);
    }

    // POST /v1/admin/jobs/status  {id, status}
    public function setStatus(): ResponseInterface
    {
        $d      = $this->request->getJSON(true) ?? [];
        $id     = (string) ($d['id'] ?? '');
        $status = (string) ($d['status'] ?? '');
        if ($id === '' || ! in_array($status, self::STATUSES, true)) {
            return api_error('id and a valid status are required', 422);
        }

        $all = $this->read('status.json', []);
        if ($status === 'new') {
            unset($all[$id]);
        } else {
            $all[$id] = $status;
        }
        $this->write('status.json', $all);

        return api_success(['id' => $id, 'status' => $status]);
    }

    private function read(string $file, array $default): array
    {
        $raw = @file_get_contents($this->dir . $file);
        $val = $raw === false ? null : json_decode($raw, true);

        return is_array($val) ? $val : $default;
    }

    private function write(string $file, array $value): void
    {
        if (! is_dir($this->dir)) {
            mkdir($this->dir, 0775, true);
        }
        $tmp = $this->dir . $file . '.tmp';
        file_put_contents($tmp, json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);
        rename($tmp, $this->dir . $file);
    }
}

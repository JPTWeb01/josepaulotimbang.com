<?php

namespace App\Controllers\Api;

use App\Models\ExperienceModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class ExperienceController extends ResourceController
{
    protected ExperienceModel $model;

    public function __construct()
    {
        helper('response');
        $this->model = new ExperienceModel();
    }

    // GET /v1/experience
    public function index(): ResponseInterface
    {
        return api_success($this->model->getAll());
    }

    // ─── Admin ────────────────────────────────────────────────────────

    public function adminIndex(): ResponseInterface
    {
        return api_success($this->model->orderBy('sort_order', 'ASC')->findAll());
    }

    public function store(): ResponseInterface
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        if (!$this->model->validate($data)) {
            return api_error('Validation failed', 422, $this->model->errors());
        }

        $id = $this->model->insert($data);
        return api_success($this->model->find($id), 'Experience created', 201);
    }

    public function update($id = null): ResponseInterface
    {
        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();

        if (!$this->model->update((int) $id, $data)) {
            return api_error('Validation failed', 422, $this->model->errors());
        }

        return api_success($this->model->find($id), 'Experience updated');
    }

    public function destroy($id = null): ResponseInterface
    {
        $this->model->delete((int) $id);
        return api_success(null, 'Experience deleted');
    }
}

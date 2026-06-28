<?php

namespace App\Controllers\Api;

use App\Models\SkillModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class SkillController extends ResourceController
{
    protected SkillModel $model;

    public function __construct()
    {
        helper('response');
        $this->model = new SkillModel();
    }

    // GET /v1/skills — returns skills grouped by category
    public function index(): ResponseInterface
    {
        $grouped = $this->model->getGrouped();

        $result = [];
        foreach ($grouped as $category => $skills) {
            $result[] = ['category' => $category, 'skills' => $skills];
        }

        return api_success($result);
    }

    // ─── Admin ────────────────────────────────────────────────────────

    public function adminIndex(): ResponseInterface
    {
        return api_success($this->model->orderBy('category')->orderBy('sort_order')->findAll());
    }

    public function store(): ResponseInterface
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        if (!$this->model->validate($data)) {
            return api_error('Validation failed', 422, $this->model->errors());
        }

        $id = $this->model->insert($data);
        return api_success($this->model->find($id), 'Skill created', 201);
    }

    public function update($id = null): ResponseInterface
    {
        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();

        if (!$this->model->update((int) $id, $data)) {
            return api_error('Validation failed', 422, $this->model->errors());
        }

        return api_success($this->model->find($id), 'Skill updated');
    }

    public function destroy($id = null): ResponseInterface
    {
        $this->model->delete((int) $id);
        return api_success(null, 'Skill deleted');
    }
}

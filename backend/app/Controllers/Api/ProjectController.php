<?php

namespace App\Controllers\Api;

use App\Models\ProjectModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class ProjectController extends ResourceController
{
    protected ProjectModel $model;

    public function __construct()
    {
        helper('response');
        $this->model = new ProjectModel();
    }

    // GET /v1/projects
    public function index(): ResponseInterface
    {
        $page    = (int) ($this->request->getGet('page') ?? 1);
        $perPage = (int) ($this->request->getGet('per_page') ?? 12);

        ['items' => $items, 'total' => $total] = $this->model->getPublished($page, $perPage);

        return api_paginated($items, $total, $page, $perPage);
    }

    // GET /v1/projects/featured
    public function featured(): ResponseInterface
    {
        return api_success($this->model->getFeatured());
    }

    // GET /v1/projects/:slug
    public function show($slug = null): ResponseInterface
    {
        $project = $this->model->getBySlug((string) $slug);

        if (!$project) {
            return api_error('Project not found', 404);
        }

        return api_success($project);
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
        return api_success($this->model->find($id), 'Project created', 201);
    }

    public function update($id = null): ResponseInterface
    {
        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();

        if (!$this->model->update((int) $id, $data)) {
            return api_error('Validation failed', 422, $this->model->errors());
        }

        return api_success($this->model->find($id), 'Project updated');
    }

    public function destroy($id = null): ResponseInterface
    {
        $this->model->delete((int) $id);
        return api_success(null, 'Project deleted');
    }
}

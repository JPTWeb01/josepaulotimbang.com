<?php

namespace App\Controllers\Api;

use App\Models\PostModel;
use App\Models\CategoryModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class PostController extends ResourceController
{
    protected PostModel     $posts;
    protected CategoryModel $categories;

    public function __construct()
    {
        helper('response');
        $this->posts      = new PostModel();
        $this->categories = new CategoryModel();
    }

    // GET /v1/posts
    public function index(): ResponseInterface
    {
        $page    = (int) ($this->request->getGet('page') ?? 1);
        $perPage = (int) ($this->request->getGet('per_page') ?? 10);

        ['items' => $items, 'total' => $total] = $this->posts->getPublished($page, $perPage);

        return api_paginated($items, $total, $page, $perPage);
    }

    // GET /v1/posts/featured
    public function featured(): ResponseInterface
    {
        return api_success($this->posts->getFeatured(3));
    }

    // GET /v1/posts/:slug
    public function show($slug = null): ResponseInterface
    {
        $post = $this->posts->getBySlug((string) $slug);

        if (!$post) {
            return api_error('Post not found', 404);
        }

        $this->posts->incrementViews($post['id']);

        $db   = db_connect();
        $cats = $db->table('post_categories pc')
            ->select('c.id, c.name, c.slug')
            ->join('categories c', 'c.id = pc.category_id')
            ->where('pc.post_id', $post['id'])
            ->get()->getResultArray();

        $tags = $db->table('post_tags pt')
            ->select('t.id, t.name, t.slug')
            ->join('tags t', 't.id = pt.tag_id')
            ->where('pt.post_id', $post['id'])
            ->get()->getResultArray();

        $post['categories'] = $cats;
        $post['tags']       = $tags;

        return api_success($post);
    }

    // GET /v1/posts/related/:slug
    public function related($slug = null): ResponseInterface
    {
        $post = $this->posts->getBySlug((string) $slug);

        if (!$post) {
            return api_error('Post not found', 404);
        }

        return api_success($this->posts->getRelated($post['id'], 3));
    }

    // POST /v1/posts/:slug/view
    public function incrementView($slug = null): ResponseInterface
    {
        $post = $this->posts->getBySlug((string) $slug);

        if ($post) {
            $this->posts->incrementViews($post['id']);
        }

        return api_success(null, 'OK');
    }

    // GET /v1/categories
    public function categories(): ResponseInterface
    {
        return api_success($this->categories->getAllWithCount());
    }

    // GET /v1/tags
    public function tags(): ResponseInterface
    {
        $db   = db_connect();
        $tags = $db->table('tags t')
            ->select('t.id, t.name, t.slug, COUNT(pt.post_id) as post_count')
            ->join('post_tags pt', 'pt.tag_id = t.id', 'left')
            ->groupBy('t.id')
            ->orderBy('t.name', 'ASC')
            ->get()->getResultArray();

        return api_success($tags);
    }

    // ─── Admin ────────────────────────────────────────────────────────

    public function adminIndex(): ResponseInterface
    {
        return api_success($this->posts->orderBy('created_at', 'DESC')->findAll());
    }

    public function store(): ResponseInterface
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        if (!$this->posts->validate($data)) {
            return api_error('Validation failed', 422, $this->posts->errors());
        }

        $id = $this->posts->insert($data);
        return api_success($this->posts->find($id), 'Post created', 201);
    }

    public function update($id = null): ResponseInterface
    {
        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();

        if (!$this->posts->update((int) $id, $data)) {
            return api_error('Validation failed', 422, $this->posts->errors());
        }

        return api_success($this->posts->find($id), 'Post updated');
    }

    public function destroy($id = null): ResponseInterface
    {
        $this->posts->delete((int) $id);
        return api_success(null, 'Post deleted');
    }
}

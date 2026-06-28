<?php

namespace App\Controllers\Api;

use App\Models\ContactModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class ContactController extends ResourceController
{
    protected ContactModel $model;

    public function __construct()
    {
        helper('response');
        $this->model = new ContactModel();
    }

    // POST /v1/contact — public submission
    public function store(): ResponseInterface
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        $rules = [
            'name'    => 'required|max_length[255]',
            'email'   => 'required|valid_email',
            'subject' => 'required|max_length[255]',
            'message' => 'required|min_length[10]',
        ];

        if (!$this->validate($rules)) {
            return api_error('Validation failed', 422, $this->validator->getErrors());
        }

        $payload = [
            'name'       => strip_tags($data['name']),
            'email'      => trim($data['email']),
            'subject'    => strip_tags($data['subject']),
            'message'    => strip_tags($data['message']),
            'ip_address' => $this->request->getIPAddress(),
        ];

        $this->model->insert($payload);

        return api_success(null, 'Message sent successfully', 201);
    }

    // ─── Admin ────────────────────────────────────────────────────────

    // GET /v1/admin/messages
    public function index(): ResponseInterface
    {
        $messages = $this->model->orderBy('created_at', 'DESC')->findAll();
        return api_success($messages);
    }

    // PATCH /v1/admin/messages/:id/read
    public function markRead($id = null): ResponseInterface
    {
        $msg = $this->model->find((int) $id);

        if (!$msg) {
            return api_error('Message not found', 404);
        }

        $this->model->markRead((int) $id);
        return api_success(null, 'Marked as read');
    }

    // DELETE /v1/admin/messages/:id
    public function destroy($id = null): ResponseInterface
    {
        $this->model->delete((int) $id);
        return api_success(null, 'Message deleted');
    }
}

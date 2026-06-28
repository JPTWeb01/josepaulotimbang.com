<?php

namespace App\Controllers\Api;

use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;

class AuthController extends ResourceController
{
    public function __construct()
    {
        helper('response');
    }

    // POST /v1/auth/login
    public function login(): ResponseInterface
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        $email    = $data['email']    ?? '';
        $password = $data['password'] ?? '';

        $adminEmail    = env('ADMIN_EMAIL',    'admin@josepaulotimbang.com');
        $adminPassword = env('ADMIN_PASSWORD', '');

        if ($email !== $adminEmail || !password_verify($password, $adminPassword)) {
            return api_error('Invalid credentials', 401);
        }

        $secret = env('JWT_SECRET', 'secret');
        $ttl    = (int) env('JWT_TTL', 86400);

        $payload = [
            'iss' => env('app.baseURL', 'http://localhost:8000'),
            'iat' => time(),
            'exp' => time() + $ttl,
            'sub' => $email,
        ];

        $token = JWT::encode($payload, $secret, 'HS256');

        return api_success([
            'token'      => $token,
            'expires_at' => date('c', $payload['exp']),
        ], 'Login successful');
    }

    // POST /v1/auth/logout — stateless JWT; client discards the token
    public function logout(): ResponseInterface
    {
        return api_success(null, 'Logged out');
    }
}

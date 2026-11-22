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
        // 5 attempts per minute per IP, to slow down password guessing.
        $key = 'login_' . md5($this->request->getIPAddress());
        if (service('throttler')->check($key, 5, MINUTE) === false) {
            return api_error('Too many attempts. Try again in a minute.', 429);
        }

        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        $email    = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');

        $adminEmail    = strtolower((string) env('ADMIN_EMAIL', ''));
        $adminPassword = (string) env('ADMIN_PASSWORD', '');

        if ($adminEmail === '' || $adminPassword === ''
            || ! hash_equals($adminEmail, $email)
            || ! password_verify($password, $adminPassword)) {
            return api_error('Invalid email or password', 401);
        }

        $ttl     = (int) env('JWT_TTL', 28800);
        $payload = [
            'iss' => 'josepaulotimbang.com',
            'iat' => time(),
            'exp' => time() + $ttl,
            'sub' => $adminEmail,
        ];

        return api_success([
            'token'      => JWT::encode($payload, jwt_secret(), 'HS256'),
            'expires_at' => date('c', $payload['exp']),
        ], 'Login successful');
    }

    // POST /v1/auth/logout — stateless JWT; client discards the token
    public function logout(): ResponseInterface
    {
        return api_success(null, 'Logged out');
    }
}

<?php

if (!function_exists('api_response')) {
    function api_response(bool $success, mixed $data = null, string $message = '', int $status = 200): \CodeIgniter\HTTP\Response
    {
        $payload = ['success' => $success];

        if ($message !== '') {
            $payload['message'] = $message;
        }

        if ($data !== null) {
            $payload['data'] = $data;
        }

        return service('response')->setJSON($payload)->setStatusCode($status);
    }
}

if (!function_exists('api_success')) {
    function api_success(mixed $data = null, string $message = 'OK', int $status = 200): \CodeIgniter\HTTP\Response
    {
        return api_response(true, $data, $message, $status);
    }
}

if (!function_exists('api_error')) {
    function api_error(string $message = 'Error', int $status = 400, mixed $errors = null): \CodeIgniter\HTTP\Response
    {
        $payload = ['success' => false, 'message' => $message];
        if ($errors !== null) {
            $payload['errors'] = $errors;
        }
        return service('response')->setJSON($payload)->setStatusCode($status);
    }
}

if (!function_exists('api_paginated')) {
    function api_paginated(array $items, int $total, int $page, int $perPage): \CodeIgniter\HTTP\Response
    {
        return api_response(true, [
            'items'       => $items,
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => (int) ceil($total / $perPage),
        ]);
    }
}

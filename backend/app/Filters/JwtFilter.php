<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;

class JwtFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return service('response')
                ->setJSON(['success' => false, 'message' => 'No token provided'])
                ->setStatusCode(401);
        }

        $token = substr($authHeader, 7);

        try {
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET', 'secret'), 'HS256'));
            $request->jwt = $decoded;
        } catch (ExpiredException) {
            return service('response')
                ->setJSON(['success' => false, 'message' => 'Token expired'])
                ->setStatusCode(401);
        } catch (SignatureInvalidException) {
            return service('response')
                ->setJSON(['success' => false, 'message' => 'Invalid token signature'])
                ->setStatusCode(401);
        } catch (\Exception) {
            return service('response')
                ->setJSON(['success' => false, 'message' => 'Invalid token'])
                ->setStatusCode(401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}

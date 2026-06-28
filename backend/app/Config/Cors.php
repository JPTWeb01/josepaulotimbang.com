<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Cors extends BaseConfig
{
    public array $allowedOrigins = [];
    public array $allowedOriginsPatterns = [];
    public bool  $supportsCredentials = false;
    public array $allowedHeaders = ['Content-Type', 'Authorization', 'X-Requested-With'];
    public array $allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
    public array $exposedHeaders = [];
    public int   $maxAge = 7200;

    public function __construct()
    {
        parent::__construct();

        $origins = env('CORS_ORIGINS', 'http://localhost:3000');
        $this->allowedOrigins = array_map('trim', explode(',', $origins));
    }
}

<?php

namespace Config;

use CodeIgniter\Database\Config;

class Database extends Config
{
    public string $filesPath = APPPATH . 'Database/';

    public string $defaultGroup = 'default';

    public array $default = [
        'DSN'          => '',
        'hostname'     => 'localhost',
        'username'     => 'root',
        'password'     => '',
        'database'     => 'portfolio_db',
        'DBDriver'     => 'MySQLi',
        'DBPrefix'     => '',
        'pConnect'     => false,
        'DBDebug'      => true,
        'charset'      => 'utf8mb4',
        'DBCollat'     => 'utf8mb4_unicode_ci',
        'swapPre'      => '',
        'encrypt'      => false,
        'compress'     => false,
        'strictOn'     => false,
        'failover'     => [],
        'port'         => 3306,
        'numberNative' => false,
    ];

    public array $tests = [
        'DSN'      => '',
        'hostname' => '127.0.0.1',
        'username' => 'root',
        'password' => '',
        'database' => 'portfolio_test',
        'DBDriver' => 'MySQLi',
        'DBPrefix' => 'test_',
        'pConnect' => false,
        'DBDebug'  => true,
        'charset'  => 'utf8mb4',
        'DBCollat' => 'utf8mb4_unicode_ci',
        'swapPre'  => '',
        'encrypt'  => false,
        'compress' => false,
        'strictOn' => false,
        'failover' => [],
        'port'     => 3306,
    ];

    public function __construct()
    {
        parent::__construct();

        // Override from .env
        if ($hostname = env('database.default.hostname')) {
            $this->default['hostname'] = $hostname;
        }
        if ($username = env('database.default.username')) {
            $this->default['username'] = $username;
        }
        if ($password = env('database.default.password')) {
            $this->default['password'] = $password;
        }
        if ($database = env('database.default.database')) {
            $this->default['database'] = $database;
        }
        if ($port = env('database.default.port')) {
            $this->default['port'] = (int) $port;
        }
    }
}

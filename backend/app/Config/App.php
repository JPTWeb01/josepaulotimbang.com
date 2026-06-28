<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class App extends BaseConfig
{
    public string $baseURL = 'http://localhost:8000/';
    public string $indexPage = '';
    public string $uriProtocol = 'REQUEST_URI';
    public string $defaultLocale = 'en';
    public bool   $negotiateLocale = false;
    public array  $supportedLocales = ['en'];
    public string $appTimezone = 'Asia/Manila';
    public string $charset = 'UTF-8';
    public bool   $forceGlobalSecureRequests = false;
    public array  $proxyIPs = [];
    public string $CSPEnabled = '';

    public string $sessionDriver            = 'CodeIgniter\Session\Handlers\FileHandler';
    public string $sessionCookieName        = 'ci_session';
    public int    $sessionExpiration        = 7200;
    public string $sessionSavePath          = WRITEPATH . 'session';
    public bool   $sessionMatchIP           = false;
    public int    $sessionTimeToUpdate      = 300;
    public bool   $sessionRegenerateDestroy = false;

    public string $cookiePrefix   = '';
    public string $cookieDomain   = '';
    public string $cookiePath     = '/';
    public bool   $cookieSecure   = false;
    public bool   $cookieHTTPOnly = false;
    public string $cookieSameSite = 'Lax';

    public string $encryptionKey = '';
    public int    $errorViewPath = 0;

    public array $allowedHostnames = [];

    public string $CSRFTokenName  = 'csrf_test_name';
    public string $CSRFHeaderName = 'X-CSRF-TOKEN';
    public string $CSRFCookieName = 'csrf_cookie_name';
    public int    $CSRFExpire     = 7200;
    public bool   $CSRFRegenerate = true;
    public bool   $CSRFRedirect   = false;
    public string $CSRFSameSite   = 'Lax';

    public string $reverseProxyIPs = '';
}

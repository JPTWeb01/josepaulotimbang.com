<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */

$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(false);

// ─── Health check ─────────────────────────────────────────────────
$routes->get('health', static function () {
    return service('response')
        ->setJSON(['status' => 'ok', 'timestamp' => date('c')])
        ->setStatusCode(200);
});

// ─── Public API v1 ────────────────────────────────────────────────
$routes->group('v1', ['namespace' => 'App\Controllers\Api'], static function ($routes) {

    // Projects
    $routes->get('projects',          'ProjectController::index');
    $routes->get('projects/featured', 'ProjectController::featured');
    $routes->get('projects/(:segment)', 'ProjectController::show/$1');

    // Skills
    $routes->get('skills', 'SkillController::index');

    // Experience
    $routes->get('experience', 'ExperienceController::index');

    // Blog
    $routes->get('posts',              'PostController::index');
    $routes->get('posts/featured',     'PostController::featured');
    $routes->get('posts/(:segment)',   'PostController::show/$1');
    $routes->get('posts/related/(:segment)', 'PostController::related/$1');
    $routes->post('posts/(:segment)/view',   'PostController::incrementView/$1');

    // Categories & tags
    $routes->get('categories', 'PostController::categories');
    $routes->get('tags',       'PostController::tags');

    // Contact
    $routes->post('contact', 'ContactController::store');

    // Auth
    $routes->post('auth/login',  'AuthController::login');
    $routes->post('auth/logout', 'AuthController::logout');

    // ─── Admin (JWT protected) ─────────────────────────────────
    $routes->group('admin', ['filter' => 'jwt'], static function ($routes) {

        // Messages
        $routes->get('messages',             'ContactController::index');
        $routes->patch('messages/(:num)/read', 'ContactController::markRead/$1');
        $routes->delete('messages/(:num)',    'ContactController::destroy/$1');

        // Projects CRUD
        $routes->get('projects',         'ProjectController::adminIndex');
        $routes->post('projects',        'ProjectController::store');
        $routes->put('projects/(:num)',  'ProjectController::update/$1');
        $routes->delete('projects/(:num)', 'ProjectController::destroy/$1');

        // Posts CRUD
        $routes->get('posts',           'PostController::adminIndex');
        $routes->post('posts',          'PostController::store');
        $routes->put('posts/(:num)',    'PostController::update/$1');
        $routes->delete('posts/(:num)', 'PostController::destroy/$1');

        // Skills CRUD
        $routes->get('skills',           'SkillController::adminIndex');
        $routes->post('skills',          'SkillController::store');
        $routes->put('skills/(:num)',    'SkillController::update/$1');
        $routes->delete('skills/(:num)', 'SkillController::destroy/$1');

        // Experience CRUD
        $routes->get('experience',           'ExperienceController::adminIndex');
        $routes->post('experience',          'ExperienceController::store');
        $routes->put('experience/(:num)',    'ExperienceController::update/$1');
        $routes->delete('experience/(:num)', 'ExperienceController::destroy/$1');
    });
});

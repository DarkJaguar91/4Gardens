<?php
    require_once __DIR__ . '/silex/vendor/autoload.php';

    $app = new Silex\Application();

    $app['debug'] = true;

    $app->get('/', function () {
        return 'Hello!';
    });

    $app->run();
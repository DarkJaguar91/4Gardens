<?php
    require_once __DIR__ . '/silex/vendor/autoload.php';

    $app = new Silex\Application();

    $app['debug'] = true;

    $app->get('/', function () {
        sleep(5);
        $test = new stdClass();
        $test->image = "assets/uploads/fountain1.jpg";
        return json_encode($test);
    });

$app->get('/bye', function () {
    return "Cheers";
});

$app->get('/bye/{id}', function ($id) {
    return "Cheers " . $id;
});

    $app->run();

//echo $_SERVER['REQUEST_URI'];
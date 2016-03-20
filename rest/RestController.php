<?php
    /**
     * Created by PhpStorm.
     * User: bjtal
     * Date: 2016/03/20
     * Time: 9:15 PM
     */

    require_once 'silex/vendor/autoload.php';
    require_once 'Product.php';

    $app = new Silex\Application();

    $app->get('/', function () {
        return "Hello world";
    });

    $app->mount('/products', new Product());


    $app->run();
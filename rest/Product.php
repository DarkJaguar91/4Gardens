<?php
    /**
     * Created by PhpStorm.
     * User: bjtal
     * Date: 2016/03/20
     * Time: 9:15 PM
     */

    use Silex\Application;
    use Silex\ControllerProviderInterface;

    require_once 'silex/vendor/autoload.php';
    require_once 'ProductController.php';

    class Product implements ControllerProviderInterface {
        public function connect(Application $app)
        {
            $products = $app['controllers_factory'];

            $products->get('/', 'ProductController::productTypes');

            $products->get('/{productType}', 'ProductController::products');

            return $products;
        }
    }
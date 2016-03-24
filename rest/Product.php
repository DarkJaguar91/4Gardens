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
    require_once 'ProductDB.php';

    class Product implements ControllerProviderInterface
    {
        var $productDb;

        /**
         * ProductController constructor.
         */
        public function __construct()
        {
            $this->productDb = new ProductDB();
        }


        public function connect(Application $app)
        {
            $products = $app['controllers_factory'];

            $products->get('/', function () {
                sleep(3);
                return json_encode($this->productDb->getTypes());
            });

            $products->get('/{productType}', function ($productType) {
                sleep(3);
                return json_encode($this->productDb->getProducts($productType));
            });

            $products->put('/type/{typeId}', function (\Symfony\Component\HttpFoundation\Request $request, $typeId) {
                sleep(3);
                $output = new stdClass();
                $output->success = false;

                $type = $request->request->get('type');

                if ($type != null && is_string($type)) {
                    $success = $this->productDb->change((int)$typeId, $type);
                    if ($success === TRUE) {
                        $output->type = new stdClass();
                        $output->type->id = $typeId;
                        $output->type->type = $type;
                        $output->success = TRUE;
                        $output->message = 'Type renamed successfully. ';

                        return new \Symfony\Component\HttpFoundation\Response(json_encode($output), 200);
                    } else {
                        $output->message = $success;
                        return new \Symfony\Component\HttpFoundation\Response(json_encode($output), 500);
                    }
                }
                $output->message = 'Type must constitute of text.';
                return new \Symfony\Component\HttpFoundation\Response(json_encode($output), 400);
            });

            $products->post('/type/new', function (\Symfony\Component\HttpFoundation\Request $request) {
                sleep(3);
                $type = $request->request->get('type');
                $output = new stdClass();
                $output->success = false;
                if ($type != null && is_string($type)) {
                    $id = $this->productDb->addType($type);
                    if ($id >= 0) {
                        $output->success = true;
                        $output->id = $id;
                        $output->message = 'Type: ' . $type . ' successfully created.';

                        return new \Symfony\Component\HttpFoundation\Response(json_encode($output), 200);
                    }
                    $output->message = 'Type could not be added.';
                    return new \Symfony\Component\HttpFoundation\Response(json_encode($output), 500);
                }
                $output->message = 'Type must constitute of text.';
                return new \Symfony\Component\HttpFoundation\Response(json_encode($output), 400);
            });

            return $products;
        }
    }
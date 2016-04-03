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
                return json_encode($this->productDb->getTypes());
            });

            $products->get('/gallery/{id}', function ($id) {
                return json_encode($this->productDb->getGallery($id));
            });

            $products->get('/{productType}', function ($productType) {
                return json_encode($this->productDb->getProducts($productType));
            });

            $products->get('/product/{id}', function ($id) {
                return json_encode($this->productDb->getProduct($id));
            });

            $products->put('/{typeId}', function (\Symfony\Component\HttpFoundation\Request $request, $typeId) {
                $output = new stdClass();
                $output->success = false;

                $type = $request->request->get('type');

                if ($type != null && is_string($type)) {
                    $success = $this->productDb->changeType((int)$typeId, $type);
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

            $products->put('/product', function (\Symfony\Component\HttpFoundation\Request $request) {
                $output = new stdClass();
                $output->success = false;
                $id = $request->request->get('id');
                $type = $request->request->get('type');
                $title = $request->request->get('title');
                $image = $request->request->get('image');
                $description = $request->request->get('description');
                $price = $request->request->get('price');

                if ($id != null) {
                    $success = $this->productDb->changeProduct((int)$id, $title, $type, $image, $description, $price);
                    if ($success === TRUE) {
                        $output->item = new stdClass();
                        $output->item->id = $id;
                        $output->item->type = $type;
                        $output->item->title = $title;
                        $output->item->description = $description;
                        $output->item->image = $image;
                        $output->item->code = $request->request->get('code');;
                        $output->item->price = $price;
                        $output->success = TRUE;
                        $output->message = 'Product changed successfully.';

                        return new \Symfony\Component\HttpFoundation\Response(json_encode($output), 200);
                    } else {
                        $output->message = $success;
                        return new \Symfony\Component\HttpFoundation\Response(json_encode($output), 500);
                    }
                }
                $output->message = 'Item not recognized';
                return new \Symfony\Component\HttpFoundation\Response(json_encode($output), 400);
            });

            $products->post('/product', function (\Symfony\Component\HttpFoundation\Request $request) {
                $output = new stdClass();
                $output->success = false;
                $output->message = [];

                $pass = true;
                $type = $request->request->get('type');
                $image = $request->request->get('image');
                $title = $request->request->get('title');
                $description = $request->request->get('description');
                $price = $request->request->get('price');
                if (is_null($type) && !is_int($type)) {
                    $pass = false;
                    $output->message[] = 'Type has to be set as an int';
                }
                if (is_null($image) && !is_string($image)) {
                    $pass = false;
                    $output->message[] = 'Image has to be set as a string';
                }
                if (is_null($title) && !is_string($title)) {
                    $pass = false;
                    $output->message[] = 'Title has to be set as a string';
                }
                if (is_null($description) && !is_string($description)) {
                    $pass = false;
                    $output->message[] = 'Description has to be set as a string';
                }
                if (is_null($price) && !is_string($price)) {
                    $pass = false;
                    $output->message[] = 'Price has to be set as a string';
                }
                if ($pass) {
                    $code = uniqid();
                    $id = $this->productDb->addProduct($type, $image, $title, $code,
                        $description, $price,
                        $request->request->get('declaration'));

                    if (is_string($id)) {
                        $output->message[] = $id;
                        return new \Symfony\Component\BrowserKit\Response(json_encode($output), 400);
                    }
                    $output->success = true;
                    $output->message[] = 'Successfully created item';
                    $output->item = new stdClass();
                    $output->item->id = $id;
                    $output->item->id = $id;
                    $output->item->image = $image;
                    $output->item->title = $title;
                    $output->item->code = $code;
                    $output->item->description = $description;
                    $output->item->price = $price;

                    return new \Symfony\Component\HttpFoundation\Response(json_encode($output), 200);
                }

                return new \Symfony\Component\HttpFoundation\Response(json_encode($output), 400);
            });

            $products->post('/', function (\Symfony\Component\HttpFoundation\Request $request) {
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

            $products->post('/gallery', function (\Symfony\Component\HttpFoundation\Request $request) {
                $type = $request->request->get('type');
                $prodID = $request->request->get('productID');
                $path = $request->request->get('path');
                $output = new stdClass();
                $output->success = false;

                if ($type != null && is_string($type)) {
                    $id = $this->productDb->addGalleryItem($type, $prodID, $path);
                    if ($id >= 0) {
                        $output->success = true;
                        $output->item = new stdClass();
                        $output->item->id = $id;
                        $output->item->type = $id;
                        $output->item->product_id = $prodID;
                        $output->item->path = $path;
                        $output->message = 'Image created successfully';

                        return new \Symfony\Component\HttpFoundation\Response(json_encode($output), 200);
                    }
                    $output->message = 'Image could not be added.';
                    return new \Symfony\Component\HttpFoundation\Response(json_encode($output), 500);
                }
                $output->message = 'Type must constitute of text.';
                return new \Symfony\Component\HttpFoundation\Response(json_encode($output), 400);
            });

            $products->delete('/product/{id}', function ($id) {
                $output = new stdClass();
                $response = $this->productDb->deleteProduct($id);
                $output->success = $response === TRUE;
                $output->message = $response;
                return new \Symfony\Component\HttpFoundation\Response(json_encode($output), $output->success ? 200 : 400);
            });

            $products->delete('/gallery/{id}', function ($id) {
                $output = new stdClass();
                $response = $this->productDb->deleteGalleryItem($id);
                $output->success = $response === TRUE;
                $output->message = $response;
                return new \Symfony\Component\HttpFoundation\Response(json_encode($output), $output->success ? 200 : 400);
            });

            $products->delete('/{id}', function ($id) {
                $output = new stdClass();
                $output->success = $this->productDb->deleteType($id);
                return new \Symfony\Component\HttpFoundation\Response(json_encode($output), $output->success ? 200 : 400);
            });

            return $products;
        }
    }
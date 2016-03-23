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

    use Symfony\Component\HttpFoundation\Request;

    $app->before(function (Request $request) {
        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }
    });

    $app->post('/upload', function () {
        $target_dir = "../assets/uploads/";
        $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
        $uploadOk = 1;
        $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);

        $result = new stdClass();
        $result->success = false;
        $result->message = array();

        if (isset($_POST["submit"])) {
            $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
            if ($check !== false) {
                $uploadOk = 1;
            } else {
                $result->message[] = 'File not an image';
                $uploadOk = 0;
            }
        }
        if (file_exists($target_file)) {
            $result->message[] = 'File with that name already exists';
            $uploadOk = 0;
        }
        if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
            && $imageFileType != "gif"
        ) {
            $result->message[] = 'File type not an supported';
            $uploadOk = 0;
        }
        if ($uploadOk == 0) {
            $result->message[] = 'Dile not uploaded';
        } else {
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                $result->message[] = 'File ' . basename($_FILES["fileToUpload"]["name"]) . ' successfully uploaded';
                $result->success = true;
            } else {
                $result->message[] = 'Error during upload, please try again';
            }
        }
    });

    $app->post('/newface', function (\Symfony\Component\HttpFoundation\Request $request) {
        return new \Symfony\Component\HttpFoundation\Response($request->get('test'), 400);
    });

    $app->mount('/products', new Product());

    $app->run();
<?php
    /**
     * Created by PhpStorm.
     * User: bjtal
     * Date: 2016/03/20
     * Time: 9:20 PM
     */

    require_once 'ProductDB.php';

class ProductController {
    var $productDb;

    /**
     * ProductController constructor.
     */
    public function __construct()
    {
        $this->productDb = new ProductDB();
    }


    public function products() {
        return json_encode($this->productDb->getProducts());
    }

    public function productList($type) {

    }
}
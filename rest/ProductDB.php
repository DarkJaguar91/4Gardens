<?php
    /**
     * Created by PhpStorm.
     * User: bjtal
     * Date: 2016/03/20
     * Time: 9:35 PM
     */

require_once 'DbAccess.php';

    class ProductDB {
        var $DbAccess;

        /**
         * ProductDB constructor.
         */
        public function __construct()
        {
            $this->DbAccess = new DBAccess();
        }

        public function getTypes() {
            return $this->DbAccess->get('SELECT * FROM product_types ORDER BY product_types.type ASC;');
        }

        public function addType($type)
        {
            return $this->DbAccess->insert('INSERT INTO product_types (type) VALUES (\'' . $type . '\');');
        }

        public function getProducts($productType) {
            return $this->DbAccess->get('SELECT * FROM products WHERE products.type=' . $productType . ';');
        }
    }
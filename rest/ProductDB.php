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

        public function getProducts() {
            return $this->DbAccess->get('SELECT * FROM product_types;');
        }
    }
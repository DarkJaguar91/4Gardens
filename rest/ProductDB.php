<?php
    /**
     * Created by PhpStorm.
     * User: bjtal
     * Date: 2016/03/20
     * Time: 9:35 PM
     */

    require_once 'DbAccess.php';

    class ProductDB
    {
        var $DbAccess;

        /**
         * ProductDB constructor.
         */
        public function __construct()
        {
            $this->DbAccess = new DBAccess();
        }

        public function getTypes()
        {
            return $this->DbAccess->get('SELECT * FROM product_types ORDER BY product_types.type ASC;');
        }

        public function addType($type)
        {
            return $this->DbAccess->insert('INSERT INTO product_types (type) VALUES (\'' . $type . '\');');
        }

        public function getProducts($productType)
        {
            return $this->DbAccess->get('SELECT * FROM products WHERE products.type=' . $productType . ';');
        }

        public function changeType($typeId, $typeName)
        {
            return $this->DbAccess->update('UPDATE product_types SET type=\'' . $typeName . '\' WHERE id=' . $typeId . ';');
        }

        public function addProduct($type, $image, $title, $code, $description, $price, $declaration)
        {
            $sql = "INSERT INTO products (type, title, code, description, price, declaration, image) VALUES (" . $type . ", '" . $title . "', '" . $code . "', '" . $description . "', " . $price . ", " . (is_null($declaration) ? "null" : "'" . $declaration . "'") . ", '" . str_replace('\\', '', $image) . "');";
            return $this->DbAccess->insert($sql);
        }

        public function changeProduct($id, $title, $type, $image, $description, $price, $declaration)
        {
            return $this->DbAccess->update("UPDATE products SET description='" . $description . "', title='" . $title . "', declaration=" . ($declaration == null ? "null" : "'" . $declaration . "'") . ", image='" . $image . "', type=" . $type . ", price=" . $price . "  WHERE id=" . $id . ";");
        }
    }
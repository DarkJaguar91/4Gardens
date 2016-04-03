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
            $sql = "INSERT INTO products (type, title, code, description, price, image) VALUES (" . $type . ", '" . $title . "', '" . $code . "', '" . $description . "', '" . $price . "', '" . str_replace('\\', '', $image) . "');";
            return $this->DbAccess->insert($sql);
        }

        public function changeProduct($id, $title, $type, $image, $description, $price)
        {
            return $this->DbAccess->update("UPDATE products SET description='" . $description . "', title='" . $title . "', image='" . $image . "', type=" . $type . ", price='" . $price . "'  WHERE id=" . $id . ";");
        }

        public function deleteGalleryItemForProduct($id)
        {
            $item = $this->DbAccess->get('SELECT * FROM gallery WHERE product_id=' . $id . ';');

            foreach ($item as &$itm) {
                unlink('../' . $itm['path']);
            }

            return $this->DbAccess->delete('DELETE FROM gallery WHERE product_id=' . $id . ';');
        }

        public function deleteProduct($id)
        {
            if ($this->deleteGalleryItemForProduct($id) === TRUE) {
                $items = $this->DbAccess->get('SELECT * FROM products WHERE id=' . $id . ';');

                foreach ($items as &$itm) {
                    unlink('../' . $itm['image']);
                }

                return $this->DbAccess->delete('DELETE FROM products WHERE id=' . $id . ';');
            }
            return false;
        }

        public function deleteGalleryItemForType($id)
        {
            $item = $this->DbAccess->get('SELECT * FROM gallery WHERE type=' . $id . ';');

            foreach ($item as &$itm) {
                unlink('../' . $itm['path']);
            }

            return $this->DbAccess->delete('DELETE FROM gallery WHERE type=' . $id . ';');
        }

        public function deleteProductForType($id)
        {
            $items = $this->DbAccess->get('SELECT * FROM products WHERE type=' . $id . ';');

            foreach ($items as &$itm) {
                unlink('../' . $itm['image']);
            }

            return $this->DbAccess->delete('DELETE FROM products WHERE type=' . $id . ';');
        }

        public function deleteType($id)
        {
            if ($this->deleteGalleryItemForType($id) === TRUE) {
                if ($this->deleteProductForType($id) === TRUE) {
                    return $this->DbAccess->delete('DELETE FROM product_types WHERE id=' . $id . ';');
                }
            }
            return false;
        }

        public function getGallery($id)
        {
            return $this->DbAccess->get('SELECT * FROM gallery WHERE product_id=' . $id . ';');
        }

        public function getProduct($id)
        {
            return $this->DbAccess->get('SELECT * FROM products WHERE id=' . $id . ';');
        }

        public function addGalleryItem($type, $prodID, $path)
        {
            $sql = "INSERT INTO gallery (product_id, path, type) VALUES (" . (int)$prodID . ", '" . $path . "', " . (int)$type . ");";
            return $this->DbAccess->insert($sql);
        }

        public function deleteGalleryItem($id)
        {
            $item = $this->DbAccess->get('SELECT * FROM gallery WHERE id=' . $id . ';');

            foreach ($item as &$itm) {
                unlink('../' . $itm['path']);
            }

            return $this->DbAccess->delete('DELETE FROM gallery WHERE id=' . $id . ';');
        }
    }
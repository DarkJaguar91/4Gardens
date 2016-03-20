<?php

class Product
{
    var $title;
    var $code;
    var $type;
    var $description;
    var $price;
    var $priceDeclaration;
    var $gallery;

    /**
     * Product constructor.
     * @param $title
     * @param $code
     * @param $type
     * @param $description
     * @param $price
     * @param $priceDeclaration
     * @param $gallery
     */
    public function __construct($title, $code, $type, $description, $price, $priceDeclaration, $gallery)
    {
        $this->title = $title;
        $this->code = $code;
        $this->type = $type;
        $this->description = $description;
        $this->price = $price;
        $this->priceDeclaration = $priceDeclaration;
        $this->gallery = $gallery;
    }
}

class DbAccess
{
    var $products;

    function __construct()
    {
        $this->products = array(
            new Product('Magic Pot', 'POT0154', 'Pots', 'Magic pot is magic', 144.55, '', array('assets/uploads/pot1.jpg')),
            new Product('Less Magic Pot', 'POT0114', 'Pots', 'Less Magic pot is less magic', 100.11, '', array('assets/uploads/pot2.jpg')),
            new Product('Fountainer', 'FOU10981', 'Fountain', 'It spews water around', 3000.50, '', array('assets/uploads/fountain1.jpg')),
            new Product('Zebra debra', 'PLT0124', 'Plants', 'Its a zebra plant thingy', 25, '', array('assets/uploads/ZebraPlant.jpg')),
            new Product('Pebbelatorium', 'PEB0114', 'Stones', 'Rocks that look okish', 5.5, '/m²', array('assets/uploads/pebbles.jpg'))
        );
    }

    function getProductTypes()
    {
        $productTypes = array(
            'Pots',
            'Fountain',
            'Plants',
            'Stones'
        );

        return json_encode($productTypes);
    }

    function getProducts($product)
    {
        if (!is_null($product)) {
            $output = array();

            foreach ($this->products as $prod) {
                if ($prod->type == $product) {
                    $output[] = $prod;
                }
            }

            return json_encode($output);
        } else {
            return json_encode($this->products);
        }
    }
}
/**
 * Created by bjtal on 2016/03/23.
 */

app.factory('products', function ($http) {
    var products = {};
    products.loadState = {};
    products.byType = {};
    products.loadListeners = {};

    products.load = function (type, onLoaded) {
        if (products.loadState[type] != null && products.loadState[type] == 2) {
            onLoaded(true, products.byType[type]);
        } else {
            //load not loaded
            if (products.loadListeners[type] == null) {
                products.loadListeners[type] = [];
            }
            products.loadListeners[type].push(onLoaded);
            if (products.loadState[type] == null || products.loadState[type] < 1) {
                products.loadState[type] = 1;

                $http.get('rest/products/' + type, {}).then(
                    function (response) {
                        products.loadState[type] = 2;
                        console.log(response.data);
                        products.byType[type] = response.data;
                        onLoaded(true, products.byType[type]);
                    },
                    function (response) {
                        onLoaded(false);
                        products.loadState[type] = -1;
                    }
                );
            }
        }
    };

    products.create = function (type, title, image, description, price, declaration, onCreated) {
        var data = {};
        data.type = type;
        data.title = title;
        data.image = image;
        data.description = description;
        data.price = price;
        data.declaration = declaration;
        console.log(data);
        $http.post('rest/products/product/new', data).then(
            function ($response) {
                if ($response.data.success) {
                    console.log($response.data.item);
                    products.byType[type].push($response.data.item);
                }
                onCreated($response.data.success, $response.data.message);
            },
            function ($response) {
                onCreated(false, $response.data.message);
            }
        );
    };

    products.update = function (item, onUpdated) {
        $http.put('rest/products/product/update', item).then(
            function (response) {
                if (response.data.success) {
                    products.byType[response.data.item.type].forEach(function (item) {
                        if (item.id == response.data.item.id) {
                            item.title = response.data.item.title;
                            item.description = response.data.item.description;
                            item.price = response.data.item.price;
                            item.declaration = response.data.item.declaration;
                            item.image = response.data.item.image;
                        }
                    });
                }
                onUpdated(true, response.data.item);
            },
            function (response) {
                onUpdated(false, response.data.message);
            }
        );
    };

    return products;
});
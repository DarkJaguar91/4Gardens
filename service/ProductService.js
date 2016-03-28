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

    products.create = function (type, title, image, description, price, onCreated) {
        var data = {};
        data.type = type;
        data.title = title;
        data.image = image;
        data.description = description;
        data.price = price;
        console.log(data);
        $http.post('rest/products/product/new', data).then(
            function ($response) {
                if ($response.data.success) {
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

    products.delete = function (id, type, onDeleted) {
        $http.delete('rest/products/product/' + id, {}).then(
            function (response) {
                if (response.data.success) {
                    var index = -1;
                    for (var i = 0; i < products.byType[type].length; ++i) {
                        if (products.byType[type][i].id == id) {
                            index = i;
                        }
                    }
                    products.byType[type].splice(index, 1);
                }
                onDeleted(response.data.success, response.data.message);
            },
            function (response) {
                onDeleted(false, response.data.message);
            }
        );
    };

    products.galleries = [];
    products.getGalleryForProduct = function (id, onComplete) {
        if (products.galleries[id] == null) {
            products.galleries[id] = [];
            $http.get('rest/products/gallery/' + id).then(
                function (response) {
                    if (response.data) {
                        products.galleries[id].push.apply(products.galleries[id], response.data);
                    }

                    onComplete(true, products.galleries[id])
                },
                function (response) {
                    onComplete(false, products.galleries[id])
                }
            )
        } else {
            onComplete(true, products.galleries[id]);
        }
    };

    products.addImage = function (productId, type, image, complete) {
        var data = {};
        data.productID = productId;
        data.type = type;
        data.path = image;
        if (products.galleries[productId] == null) {
            productId.galleries[productId] = [];
        }
        $http.post('rest/products/gallery', data).then(
            function (response) {
                if (response.data.success) {
                    products.galleries[productId].push(response.data.item);
                    complete(true, response.data.item);
                } else {
                    complete(response.data.success, response.data.message);
                }
            },
            function (response) {
                complete(false, response.data.message);
            }
        );
    };

    products.deleteGalleryItem = function (id, productId, onDeleted) {
        $http.delete('rest/products/gallery/' + id).then(
            function (response) {
                if (response.data.success) {
                    var index = -1;
                    for (var i = 0; i < products.galleries[productId].length; ++i) {
                        if (products.galleries[productId][i].id == id) {
                            index = i;
                        }
                    }
                    products.galleries[productId].splice(index, 1);
                }
                onDeleted(response.data.success, response.data.message);
            },
            function (response) {
                onDeleted(false, response.data.message);
            }
        )
    };

    return products;
});
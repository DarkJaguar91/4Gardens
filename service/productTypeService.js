/**
 * Created by bjtal on 2016/03/21.
 */

app.factory('productTypes', function ($http) {
    var productTypes = {};
    productTypes.list = [];
    productTypes.loadState = 0;
    productTypes.listeners = [];

    productTypes.load = function (onLoaded) {
        if (productTypes.loadState == 2) {
            onLoaded(true);
        } else {
            productTypes.listeners.push(onLoaded);
            if (productTypes.loadState <= 0) {
                productTypes.loadState = 1;
                $http.get('rest/products', {}).then(
                    function (response) {
                        productTypes.addTypes(response.data);
                        productTypes.listeners.forEach(function (listener) {
                            listener(true);
                        });
                        productTypes.listeners = [];
                        productTypes.loadState = 2;
                    },
                    function () {
                        productTypes.listeners.forEach(function (listener) {
                            listener(false);
                        });
                        productTypes.listeners = [];
                        productTypes.loadState = -1;
                    }
                );
            }
        }
    };

    productTypes.create = function ($typeName, onCreated) {
        var data = {};
        data.type = $typeName;
        $http.post('rest/products/type/new', data).then(
            function ($response) {
                if ($response.data.success) {
                    productTypes.addTypes([{id: $response.data.id, type: $typeName}]);
                }
                onCreated($response.data.success, $response.data.message);
            },
            function ($response) {
                onCreated(false, $response.data.message);
            }
        );
    };

    productTypes.rename = function (id, type, onFinish) {
        var data = {'type': type};
        $http.put('rest/products/type/' + id, data).then(
            function (response) {
                if (response.data.success) {
                    productTypes.list.forEach(function (type) {
                        if (type.id == response.data.type.id) {
                            type.type = response.data.type.type;
                        }
                    })
                }

                onFinish(response.data.success, response.data);
            },
            function (response) {
                onFinish(false, response.data);
            }
        );
    };

    productTypes.delete = function (id, onDeleted) {
        $http.delete('rest/products/type/' + id).then(
            function (response) {
                if (response.data.success) {
                    var index = -1;
                    for (var i = 0; i < productTypes.list.length; ++i) {
                        if (productTypes.list[i].id == id) {
                            index = i;
                        }
                    }
                    productTypes.list.splice(index, 1);
                }
                onDeleted(true, id);
            },
            function (response) {
                onDeleted(false, response.data.message);
            }
        );
    };

    productTypes.addTypes = function (typeArray) {
        productTypes.list.push.apply(productTypes.list, typeArray);
    };

    productTypes.getTypeById = function (id) {
        productTypes.list.forEach(function (type) {
            if (type.id == id) {
                return type;
            }
        });
        return null;
    };

    return productTypes;
});
/**
 * Created by bjtal on 2016/03/21.
 */

app.factory('productTypes', function ($http) {
    var productTypes = {};
    productTypes.list = [];
    productTypes.loadState = 0;
    productTypes.listeners = [];

    productTypes.load = function (admin, onLoaded) {
        if (productTypes.loadState == 2) {
            onLoaded(true);
        } else {
            productTypes.listeners.push(onLoaded);
            if (productTypes.loadState <= 0) {
                productTypes.loadState = 1;
                $http.get(admin ? '../rest/products' : 'rest/products', {}).then(
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
        $http.post('../rest/products/newtype', data).then(
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
/**
 * Created by bjtal on 2016/03/21.
 */

app.factory('productTypes', function ($http) {
    var productTypes = {};
    productTypes.list = [];
    productTypes.state = 0;
    productTypes.listeners = [];

    productTypes.load = function (admin, onLoaded) {
        if (productTypes.state == 2) {
            onLoaded(true);
        } else {
            productTypes.listeners.push(onLoaded);
            if (productTypes.state <= 0) {
                productTypes.state = 1;
                $http.get(admin ? '../rest/products' : 'rest/products', {}).then(
                    function (response) {
                        productTypes.addTypes(response.data);
                        productTypes.listeners.forEach(function (listener) {
                            listener(true);
                        });
                        productTypes.listeners = [];
                        productTypes.state = 2;
                    },
                    function () {
                        productTypes.listeners.forEach(function (listener) {
                            listener(false);
                        });
                        productTypes.listeners = [];
                        productTypes.state = -1;
                    }
                );
            }
        }
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
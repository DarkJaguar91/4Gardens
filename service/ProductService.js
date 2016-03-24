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

    return products;
});
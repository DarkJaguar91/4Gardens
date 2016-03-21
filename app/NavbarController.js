/**
 * Created by bjtal on 2016/03/21.
 */

app.controller("NavbarController", function ($scope, $http, productTypes) {
    $scope.state = 'loading';
    $scope.products = productTypes.list;

    productTypes.load(false, function (success) {
        if (success) {
            $scope.state = 'loaded';
        } else {
            $scope.state = 'failed';
        }
    });
});
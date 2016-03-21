/**
 * Created by bjtal on 2016/03/21.
 */


app.directive('iso-grid', function() {
    function link(scope, element, attrs) {
        scope.$watch(attrs.ngModel, function() {
            alert('here');
        });
    }

    return {
        link: link
    };
});

app.controller("ProductTypesController", function ($scope, productTypes) {
    $scope.state = 'loading';
    $scope.types = productTypes.list;

    productTypes.load(true, function (success) {
        if (success) {
            $scope.state = 'loaded';
        } else {
            $scope.state = 'error';
        }
    });
});
/**
 * Created by bjtal on 2016/03/21.
 */

app.controller("ProductsController", function ($scope, $routeParams, $http) {
        $scope.state = 'loading';
        $http.get('rest/products/' + $routeParams.id, {}).then(
            function ($request) {
                $scope.products = $request.data;
                if ($scope.products.length > 0)
                    $scope.state = 'done';
                else
                    $scope.state = 'empty';
            },
            function ($request) {
                // TODO Show retry button
            }
        );

        $scope.isotoped = false;
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            if ($scope.isotoped) {
                $('.productContainer').isotope()
                    .isotope('appended', $('.productContainer').find('.product:last'))
                    .isotope('layout');
            } else {
                $scope.isotoped = true;
                $('.productContainer').isotope({
                    itemSelector: '.product'
                });
            }
        });
    })
    .directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }
    });
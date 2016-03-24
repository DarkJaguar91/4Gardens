/**
 * Created by bjtal on 2016/03/23.
 */

app.controller("ProductsController", ['$scope', '$routeParams', 'products', function ($scope, $routeParams, products) {
    $scope.list = [];
    products.load($routeParams.id, function (success, values) {
        if (success) {
            $scope.list = values;
            if ($scope.list.length === 0) {
                $scope.empty = true;
            }
        } else {
            // WTF ERROR
        }
    });

    $scope.onSearchChanged = function () {
        console.log($('.product:first').find('.productTitle').text());
        if ($scope.isotoped) {
            $('#container').isotope();
        }
    };

    $scope.$on('ngRepeatFinished', function () {
        if ($scope.isotoped) {
            $('#container').isotope()
                .isotope('appended', $('#container').find('.product:last')).isotope();
        } else {
            $scope.isotoped = true;

            $('#container').isotope({
                layoutMode: 'packery',
                itemSelector: '.product',
                getSortData: {
                    title: function (itemElem) {
                        return $(itemElem).find('.productTitle').text().toLowerCase();
                    }
                },
                sortBy: 'title',
                filter: function () {
                    if (!$scope.search || 0 === $scope.search.length) {
                        return true;
                    } else {
                        var text = $(this).find('.productTitle').text().toLowerCase();
                        var price = $(this).find('.productPrice').text().toLowerCase();
                        return text.indexOf($scope.search.toLowerCase()) > -1 || price.indexOf($scope.search.toLowerCase()) > -1;
                    }
                }
            }).isotope();
        }
    });
}]);
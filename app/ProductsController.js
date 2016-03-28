/**
 * Created by bjtal on 2016/03/21.
 */

app.controller("ProductsController", ['$scope', '$routeParams', 'products', '$timeout', function ($scope, $routeParams, products, $timeout) {
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
        if ($scope.isotoped) {
            $('#container').isotope();
        }
    };

    $scope.showProduct = function (item) {
        $('#product-modal').modal('show');

        $scope.selected = item;
        if (item) {
            $('#links').empty();
            $('#links').isotope('destroy');
            $scope.setupModal();
        }
    };

    $scope.setupModal = function () {
        products.getGalleryForProduct($scope.selected.id, function (success, items) {
            items.forEach(function (item) {
                var $a = createNewImageItem(item);

                $('#links').append($a);
            });
            $timeout(function () {
                $('#links').isotope({
                    itemSelector: '.gallery-item'
                });
            }, 500);
        });
    };

    function createNewImageItem(item) {
        return $('<div class="gallery-item">' +
            '<a href="' + item.path + '" title="" data-gallery>' +
            '<img class="fit" src="' + item.path + '" alt="Image">' +
            '</a>' +
            '</div>');
    }

    $scope.$on('ngRepeatFinished', function () {
        if ($scope.isotoped == null || !$scope.isotoped) {
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
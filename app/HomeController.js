app.controller("HomeController", ['$scope', '$routeParams', 'products', '$timeout', function ($scope, $routeParams, products, $timeout) {
    $scope.list = [];
    $scope.empty = false;

    products.getRandomGallery(function (success, items) {
        $scope.list = items;
        var $a = $('<ul>');

        items.forEach(function (item) {
            $a.append('<li class="flipster_item"><a href="#/product/' + item.type + '"><img class="flipster_item fit" src=' + item.path + ' /></a></li>');
        });

        $('.flipster_section').append($a)
        $('.flipster_section').flipster({
            loop: true,
            autoplay: 5000,
            style: 'carousel',
            spacing: 0.1
        });
    });
}]);
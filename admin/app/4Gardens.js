/**
 * Created by bjtal on 2016/03/19.
 */

var app = angular.module("4GardensAdmin", ['ngRoute', 'ngAnimate'])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/types', {
                templateUrl: 'admin/views/types.html',
                controller: 'ProductTypesController'
            }).when('/product/:id', {
                templateUrl: 'admin/views/products.html',
                controller: 'ProductsController'
            }).otherwise({
                redirectTo: '/types'
            });
        }])
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
    
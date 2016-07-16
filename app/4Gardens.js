/**
 * Created by bjtal on 2016/03/19.
 */

var app = angular.module("4Gardens", ['ngRoute', 'ngAnimate'])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/home', {
                templateUrl: 'views/home.html',
                controller: 'HomeController'
            }).when('/contact', {
                templateUrl: 'views/contact.html',
                controller: 'ContactController'
            }).when('/product/:id', {
                templateUrl: 'views/products.html',
                controller: 'ProductsController'
            }).otherwise({
                redirectTo: '/home'
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
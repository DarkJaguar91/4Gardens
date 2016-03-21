/**
 * Created by bjtal on 2016/03/19.
 */

var app = angular.module("4GardensAdmin", ['ngRoute', 'ngAnimate'])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/admin', {
                templateUrl: 'views/admin.html'
            }).when('/types', {
                templateUrl: 'views/types.html',
                controller: 'ProductTypesController'
            }).otherwise({
                redirectTo: '/admin'
            });
        }]);
    
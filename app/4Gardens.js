/**
 * Created by bjtal on 2016/03/19.
 */

var app = angular.module("4Gardens", ['ngRoute', 'ngAnimate']);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        }).otherwise({
            redirectTo: '/home'
        });
    }]);

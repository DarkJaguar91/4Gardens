/**
 * Created by bjtal on 2016/03/21.
 */

var app = angular.module('Test', [])
    .controller('Controller', ['$scope', function ($scope) {
        $scope.name = [
            {
                name: 'test0',
                cls: 'a'
            },
            {
                name: 'test1',
                cls: 'a'
            },
            {
                name: 'test2',
                cls: 'b'
            },
            {
                name: 'test3',
                cls: 'a'
            }
        ];

        $scope.add = function () {
            $scope.name.push({
                name: 'test' + $scope.name.length
            });
            $scope.asd += 1;
        };

        $scope.isotoped = false;
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            if ($scope.isotoped) {
                $('#asd').isotope()
                    .isotope( 'appended', $('#asd').find('.grid-item:last') )
                    .isotope('layout');
            } else {
                $scope.isotoped = true;
                $('#asd').isotope({
                    itemSelector: '.grid-item'
                });
            }
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
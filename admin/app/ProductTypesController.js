/**
 * Created by bjtal on 2016/03/21.
 */

app.controller('ProductTypesController', ['$scope', '$timeout', 'productTypes', function ($scope, $timeout, productTypes) {
        $scope.state = 'loading';
        $scope.search = '';

        $scope.types = productTypes.list;

        productTypes.load(true, function (success) {
            if (success) {
                $scope.state = 'loaded';
            } else {
                $scope.state = 'error';
            }
        });

        $scope.onSearchChanged = function () {
            if ($scope.isotoped) {
                $('#container').isotope();
            }
        };

        $scope.onNewClick = function () {
            if (!$scope.creating) {
                $scope.creating = true;
                var $type = $('#newText').val();
                $scope.newTextError = null;

                if ($type && $type.length > 0) {
                    productTypes.create($type, function (success, message) {
                        if (success) {
                            $('#newText').val('');
                        } else {
                            $scope.newTextError = message;
                        }
                        $scope.creating = false;
                    });
                } else {
                    $scope.newTextError = 'Please enter a type name.';
                    $scope.creating = false;
                }
            }
        };

        $scope.onRename = function ($id) {
            var error = $('#error' + $id);
            var text = $('#input' + $id).val();
            var renameText = $('#btn' + $id).find('.rename-text');
            var renameLoad = $('#btn' + $id).find('.rename-load');
            renameText.hide();
            renameLoad.show();
            error.hide();

            if (text && text.length > 0) {
                productTypes.rename($id, text, function (success, response) {
                    renameText.show();
                    renameLoad.hide();
                    if (success) {
                        $('#input' + response.type.id).val('');
                        $timeout(function () {
                            $('#container').isotope('updateSortData', $('.type-item').get()).isotope();
                        }, 10);
                    } else {
                        error.find('p').text(response.message);
                        error.show();
                    }
                });
            } else {
                renameText.show();
                renameLoad.hide();
                error.find('p').text("Please enter a type name.");
                error.show();
            }
        };

        $scope.$on('ngRepeatFinished', function () {
            if ($scope.isotoped) {
                $('#container').isotope()
                    .isotope('appended', $('#container').find('.type-item:last')).isotope();
            } else {
                $scope.isotoped = true;

                $('#container').isotope({
                    itemSelector: '.type-item',
                    getSortData: {
                        type: function (itemElem) {
                            return $(itemElem).find('input[type=text]').attr('placeholder').toLowerCase();
                        }
                    },
                    sortBy: 'type',
                    filter: function () {
                        if (!$scope.search || 0 === $scope.search.length) {
                            return true;
                        } else {
                            var text = $(this).find('input[type=text]').attr('placeholder').toLowerCase()
                            return text.indexOf($scope.search.toLowerCase()) > -1;
                        }
                    }
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
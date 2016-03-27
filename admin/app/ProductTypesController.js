/**
 * Created by bjtal on 2016/03/21.
 */

app.controller('ProductTypesController', ['$scope', '$timeout', 'productTypes', 'notifier', function ($scope, $timeout, productTypes, notifier) {
        $scope.state = 'loading';
        $scope.search = '';

        $scope.types = productTypes.list;

    productTypes.load(function (success) {
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

                if ($type && $type.length > 0) {
                    productTypes.create($type, function (success, message) {
                        if (success) {
                            $('#newText').val('');
                            notifier.success("Type created");
                        } else {
                            notifier.alert(message);
                        }
                        $scope.creating = false;
                    });
                } else {
                    notifier.alert('Please enter a type name.');
                    $scope.creating = false;
                }
            }
        };

        $scope.onRename = function ($id) {
            var text = $('#input' + $id).val();
            var renameText = $('#btn' + $id).find('.rename-text');
            var renameLoad = $('#btn' + $id).find('.rename-load');
            renameText.hide();
            renameLoad.show();

            if (text && text.length > 0) {
                productTypes.rename($id, text, function (success, response) {
                    renameText.show();
                    renameLoad.hide();
                    if (success) {
                        $('#input' + response.type.id).val('');
                        notifier.success("Type renamed");
                        $timeout(function () {
                            $('#container').isotope('updateSortData', $('.type-item').get()).isotope();
                        }, 10);
                    } else {
                        notifier.alert(response.message);
                    }
                });
            } else {
                renameText.show();
                renameLoad.hide();
                notifier.alert("Please enter a type name.");
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
                }).isotope();
            }
        });
}]);
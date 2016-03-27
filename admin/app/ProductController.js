/**
 * Created by bjtal on 2016/03/23.
 */

app.controller("ProductsController", ['$scope', '$routeParams', 'products', 'Upload', 'notifier', '$timeout', function ($scope, $routeParams, products, Upload, notifier, $timeout) {
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

    $scope.showProduct = function (item) {
        $('#product-modal').modal('show');

        $scope.selected = item;
        $scope.clearModal();
        if (item) {
            $scope.setupModal();
            $scope.submitName = 'Apply';
        } else {
            $scope.submitName = 'Create';
        }
    };

    $scope.clearModal = function () {
        $scope.imageToUpload = null;
        $('#modal-title').val('');
        $('#modal-description').val('');
        $('#modal-price').val('');
        $('#modal-declaration').val('');
    };

    $scope.setupModal = function () {
        $('#modal-title').val($scope.selected.title);
        $('#modal-description').val($scope.selected.description);
        $('#modal-price').val($scope.selected.price);
        $('#modal-declaration').val($scope.selected.declaration);
    };

    $scope.imageSelected = function (event) {
        $('#modal-image').attr('src', URL.createObjectURL(event[0]));
        $scope.imageToUpload = event[0];
    };

    $scope.$watch('files', function () {
        $scope.imageSelected($scope.files);
    });

    $scope.onSubmit = function () {
        if ($scope.canMakeRequest()) {
            $scope.setModalLoading();
            if ($scope.imageToUpload) {
                Upload.upload({
                    url: 'rest/upload',
                    file: $scope.imageToUpload
                }).then(function (response) { // success
                    console.log('success');
                    console.log(response);
                    $scope.imageToUpload = null;
                    if ($scope.selected == null) {
                        $scope.createItem(response.data.url);
                    } else {
                        $scope.updateItem(response.data.url);
                    }
                }, function (response) { // error
                    console.log('fail');
                    console.log(response.data);
                    $scope.imageToUpload = null;
                    response.data.message.forEach(function (msg) {
                        notifier.alert(msg);
                    });
                    $scope.setModalVisible();
                }, function (evt) { // progress
                    var progressPercentage = parseInt(100.0 *
                        evt.loaded / evt.total);
                    console.log(progressPercentage);
                });
            } else {
                $scope.updateItem(null);
            }
        }
    };

    $scope.canMakeRequest = function () {
        var pass = true;
        var image = $scope.imageToUpload == null ? $scope.selected != null ? $scope.selected.image : null : $scope.imageToUpload;
        if (image == null || image.length === 0) {
            pass = false;
            notifier.alert('Please select an image');
        }
        if ($('#modal-title').val() == null || $('#modal-title').val().length === 0) {
            pass = false;
            notifier.alert('Please enter a title');
        }
        if ($('#modal-description').val() == null || $('#modal-description').val().length === 0) {
            pass = false;
            notifier.alert('Please enter a description');
        }
        if ($('#modal-price').val() == null || $('#modal-price').val().length === 0) {
            pass = false;
            notifier.alert('Please enter a price');
        }

        return pass;
    };

    $scope.createItem = function (image) {
        products.create($routeParams.id, $('#modal-title').val(), image, $('#modal-description').val(),
            parseFloat($('#modal-price').val()), $('#modal-declaration').val(), function (success, data) {
                if (success) {
                    notifier.success("Item created successfully");
                    $('.modal').modal('hide');
                } else {
                    notifier.alert(data);
                }
                $scope.setModalVisible();
            });
    };

    $scope.updateItem = function (newUrl) {
        if (newUrl != null) {
            $scope.selected.image = newUrl;
        }

        $scope.selected.title = $('#modal-title').val();
        $scope.selected.description = $('#modal-description').val();
        $scope.selected.price = parseFloat($('#modal-price').val());
        $scope.selected.declaration = $('#modal-declaration').val();

        products.update($scope.selected, function (success, message) {
            if (success) {
                notifier.success("Product Updated");
                $timeout(function () {
                    $('#container').isotope('updateSortData', $('.product').get()).isotope();
                }, 10);
            } else {
                notifier.alert(message);
            }
            $scope.setModalVisible();
        });
    };

    $scope.setModalLoading = function () {
        $('#modal-load').show();
        $('#modal-data').hide();
    };

    $scope.setModalVisible = function () {
        $('#modal-load').hide();
        $('#modal-data').show();
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
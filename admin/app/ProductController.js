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
        $('#delete-btn').hide();
        $('#modal-image').attr('src', '');
        $('#links').isotope('remove', $('#links').children()).isotope('destroy');
        $('#links').empty();
    };

    $scope.setupModal = function () {
        $('#modal-title').val($scope.selected.title);
        $('#modal-description').val($scope.selected.description);
        $('#modal-price').val($scope.selected.price);
        $('#modal-declaration').val($scope.selected.declaration);
        $('#delete-btn').show();

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
                    $scope.imageToUpload = null;
                    if ($scope.selected == null) {
                        $scope.createItem(response.data.url);
                    } else {
                        $scope.updateItem(response.data.url);
                    }
                }, function (response) { // error
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

    $scope.delete = function () {
        noty({
            text: 'Are you sure you want to delete this item?',
            type: 'error',
            dismissQueue: true,
            layout: 'center',
            buttons: [
                {
                    addClass: 'btn btn-primary', text: 'Delete', onClick: function ($noty) {
                    $noty.close();
                    $scope.setModalLoading();
                    products.delete($scope.selected.id, $routeParams.id, function (success, message) {
                        if (success) {
                            notifier.success("Successfully deleted");
                            $('#container').isotope('remove', $('#container').find('.product[id=' + $scope.selected.id + ']')).isotope();
                            $('.modal').modal('hide');
                        } else {
                            notifier.alert(message);
                        }
                        $scope.setModalVisible();
                    });
                }
                },
                {
                    addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                    $noty.close();
                }
                }
            ]
        });
    };

    $scope.deleteGalleryItem = function (id) {
        var item = $('.gallery-item[gallery-id=' + id + ']');
        var btn = item.find('.gallery-delete-image');
        btn.attr('src', 'assets/images/loading.gif');
        products.deleteGalleryItem(id, $scope.selected.id, function (success, message) {
            btn.attr('src', 'assets/images/clear.png');
            if (success) {
                $('#links').isotope('remove', item).isotope();
            } else {
                notifier.alert(message);
            }
        });
    };

    function createNewImageItem(item) {
        return $('<div class="gallery-item" gallery-id="' + item.id + '">' +
            '<a href="' + item.path + '" title="" data-gallery>' +
            '<img class="fit" src="' + item.path + '" alt="Image">' +
            '</a>' +
            '<button style="position: absolute; bottom: 0; right: 0" class="btn btn-default" onclick="angular.element(this).scope().deleteGalleryItem(' + item.id + ')">' +
            '<img class="gallery-delete-image" style="max-width: 15px" src="assets/images/clear.png" />' +
            '</button>' +
            '</div>');
    }

    $scope.uploadGallery = function (files) {
        if (files == null || files[0] == null) {
            return;
        }
        Upload.upload({
            url: 'rest/upload',
            file: files[0]
        }).then(function (response) { // success
            products.addImage($scope.selected.id, $routeParams.id, response.data.url, function (success, data) {
                if (success) {
                    var $a = createNewImageItem(data);

                    $('#links').append($a)
                        .isotope('appended', $a).isotope();
                    ;
                } else {
                    notifier.alert(data);
                }
            });
        }, function (response) { // error
            response.data.message.forEach(function (msg) {
                notifier.alert(msg);
            });
        }, function (evt) { // progress
            var progressPercentage = parseInt(100.0 *
                evt.loaded / evt.total);
            console.log(progressPercentage);
        });
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
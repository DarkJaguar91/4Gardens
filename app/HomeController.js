/**
 * Created by bjtal on 2016/03/19.
 */

app.controller("HomeController", function ($scope, $http) {
    $scope.loading = true;
    $scope.image = "assets/images/loading.gif";
    $scope.tst = "here";

    $http.get('rest/test.php', {}).then(
        function(response) {
            $scope.data = response.data;
            $scope.image = $scope.data.image;
            $scope.loading = false;
        },
        function (response) {
            $scope.tst = "FLAIL";
        }
    );
});
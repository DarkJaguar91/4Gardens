/**
 * Created by bjtal on 2016/03/27.
 */


app.factory('notifier', function () {
    var notifier = {};

    notifier.alert = function (message) {
        noty({
            text: message,
            layout: 'topCenter',
            type: 'error',
            timeout: 4000
        });
    };

    notifier.success = function (message) {
        noty({
            text: message,
            layout: 'topCenter',
            type: 'success',
            timeout: 4000
        });
    };

    return notifier;
});

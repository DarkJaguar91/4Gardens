/**
 * Created by bjtal on 2016/03/21.
 */

$(window).load(function(){
    var $container = $('.productContainer');
    $container.isotope({
        filter: '*',
        animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false
        }
    });
});

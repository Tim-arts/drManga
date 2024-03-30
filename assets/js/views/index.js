// Import base files
require('css/views/index.less');

// Import dependencies
require('vendor/slick-slider.js');
require('vendor/ratings.js');

// Import init
require('views/base/_init-slider.js');

require('lightslider/dist/js/lightslider')

$(document).ready(function () {
    $("#light-slider").lightSlider({
        item: 3,
        autoWidth: false,
        slideMove: 1, // slidemove will be 1 if loop is true
        slideMargin: 50,
        vertical: false,
        verticalHeight: 500,

        pager: true,
        gallery: false,

        auto: true,
        loop: true,
        pause: 7500,
        pauseOnHover: true,

        enableTouch: true,
    });
});

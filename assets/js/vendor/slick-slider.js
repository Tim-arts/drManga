// Require plugins
// Slick: http://kenwheeler.github.io/slick/
require('../vendor/slick.js');
require("slick-carousel/slick/slick.css");
require("slick-carousel/slick/slick-theme.css");

// Require module files
require('css/modules/src/_slick-slider.less');

$(function () {
    let slider = $('.image-slider-container');

    if (slider.length > 0) {
        slider.slick({
            arrows: false,
            dots: false,
            infinite: false,
            speed: 300,
            autoplay: true,
            slidesToShow: 5,
            slidesToScroll: 3,
            responsive: [
                {
                    breakpoint: 1899,
                    settings: {
                        slidesToShow: 5,
                        slidesToScroll: 5,
                        infinite: true,
                        centerMode: true
                    }
                },
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4,
                        infinite: true
                    }
                },
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        infinite: true
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true
                    }
                }
            ]
        });
    }
});

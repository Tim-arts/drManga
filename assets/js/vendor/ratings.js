// Require plugins
// RateYo: http://rateyo.fundoocode.ninja/
require('rateyo');

$(function () {
    let ratingStars = Array.from(document.querySelectorAll('.rateyo'));

    for (let rating of ratingStars) {
        let _this = rating;

        $(rating).rateYo({
            normalFill: '#2e2e2e',
            ratedFill: '#f9ba4d',
            starSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 49.9 49.9"><path d="M48.9,22.7c1-1,1.3-2.4,0.9-3.7c-0.4-1.3-1.5-2.2-2.9-2.4l-12.1-1.8c-0.5-0.1-1-0.4-1.2-0.9L28.2,3c-0.6-1.2-1.8-2-3.2-2c-1.4,0-2.6,0.8-3.2,2l-5.4,11c-0.2,0.5-0.7,0.8-1.2,0.9L3.1,16.6c-1.4,0.2-2.5,1.1-2.9,2.4c-0.4,1.3-0.1,2.7,0.9,3.7l8.7,8.5c0.4,0.4,0.5,0.9,0.5,1.4l-2.1,12C8,45.8,8.3,46.8,9,47.6c1.1,1.3,2.9,1.7,4.4,0.9l10.8-5.7c0.5-0.2,1-0.2,1.5,0l10.8,5.7c0.5,0.3,1.1,0.4,1.7,0.4c1.1,0,2.1-0.5,2.7-1.3c0.7-0.8,1-1.8,0.8-2.9l-2.1-12c-0.1-0.5,0.1-1,0.5-1.4L48.9,22.7z"/></svg>'
        });

        // Add trigger
        _this.onclick = function () {
            if (!this.getAttribute('data-rateyo-read-only')) {
                let value = $(_this).rateYo("rating");

                $.ajax({
                    method: "POST",
                    url: _this.getAttribute('data-url'),
                    data: {
                        'value': value,
                    },
                    success: function (response) {
                        $.toast({
                            heading: 'Message',
                            text: response.message,
                            showHideTransition: 'fade',
                            icon: response.success ? 'success' : 'error',
                            hideAfter: 5000,
                            stack: false
                        });
                    }
                });
            }
        }
    }
});

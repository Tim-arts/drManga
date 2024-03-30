// Require the base less files
require('css/base.less');
require('css/views/manga/read.less');

// Import plugins
require('vendor/LightGallery/lg-utils.js');
require('vendor/LightGallery/lightgallery.js');
require('vendor/LightGallery/lg-zoom.js');
// require('vendor/LightGallery/lg-thumbnail.js');
require('vendor/LightGallery/lg-fullscreen.js');
require('vendor/LightGallery/lg-history.js');
require('vendor/LightGallery/lg-buttons.js');

$(function () {
    // Init plugins
    let element = document.getElementById('gallery');

    if (!element) {
        require('bootstrap');

        let modalRechargePills = document.getElementById('modal-recharge-pills');
        $(modalRechargePills).modal({
            backdrop: 'static',
            keyboard: false
        });
    } else {
        let pills = Number(element.getAttribute('data-pills')),
            cost = Number(element.getAttribute('data-cost')),
            unlocked = Number(element.getAttribute('data-unlocked')),
            galleryAccess = !!(unlocked > 0); // Convert value to boolean

        // Verifications before calling the reader
        if ((pills > 0) || galleryAccess) {
            let index = Number(document.location.href.split('/').pop()) - 1,
                options = {
                    index: index,
                    dynamic: true,
                    dynamicEl: (function () {
                        let elements = [];

                        // Add images to load and display
                        for (let path in paths) {
                            let object = {
                                downloadUrl: false,
                                src: paths[path],
                                thumb: paths[path],
                                default: false
                            };

                            elements.push(object);
                        }

                        for (let i = 0, iCount = index - 4; i < iCount; i++) {
                            let object = {
                                downloadUrl: false,
                                src: element.getAttribute('data-default-placeholder-large'),
                                thumb: element.getAttribute('data-default-placeholder-medium'),
                                default: true
                            };

                            paths.unshift(object.src);
                            elements.unshift(object);
                        }

                        return elements;
                    })(),
                    mousewheel: false,
                    enableSwipe: false,
                    enableDrag: true,
                    fullScreen: true,
                    isTouch: false,
                    zoom: true,
                    autoplay: false,
                    thumbnail: false,
                    loop: false,
                    escKey: false,
                    closable: false,
                    hideBarsDelay: 2000,
                    count: Number(element.getAttribute('data-count')),
                    history: true,
                    thumbDestroy: false,
                    pills: pills,
                    cost: cost,
                    unlocked: unlocked,
                    nextHtml: '<div class="btn rounded tall theme-6"><span id="lg-cost-page" class="text-white mr-2">'+ cost +'</span><img src="/img/svg/pill.svg" alt="Pill" class="svg vertical-align-bottom mr-1" /><svg class="vertical-align-sub" version="1.1" x="0px" y="0px" width="18" height="18" viewBox="0 0 444.8 444.8"><path d="M140.2,419.9c-3.4,0-5.7-0.9-8-3.3l-21.5-21.2c-2.4-2.6-3.4-5.1-3.4-8.5s0.9-5.7,3.3-8L267,222.5l-156.3-156c-2.5-2.6-3.5-5.1-3.5-8.5s0.9-5.7,3.3-8l21.9-21.6l0.2-0.2c2.2-2.3,4.1-3.1,7.6-3.1s5.4,0.8,7.6,3.1l0.2,0.2l186.3,186.1c2.4,2.4,3.3,4.5,3.3,8c0,3.4-1,5.9-3.6,8.6L148.2,416.7C145.9,419,143.6,419.9,140.2,419.9z"/></svg></div>',
                    prevHtml: '<div class="btn rounded tall theme-6"><svg class="vertical-align-sub" version="1.1" x="0px" y="0px" width="18" height="18" viewBox="0 0 444.8 444.8"><path d="M296.6,416.7L110.8,231.1c-2.6-2.7-3.6-5.2-3.6-8.6c0-3.5,0.9-5.6,3.3-8L296.8,28.4l0.2-0.2c2.2-2.3,4.1-3.1,7.6-3.1s5.4,0.8,7.6,3.1l0.2,0.2L334.3,50c2.4,2.3,3.3,4.6,3.3,8s-1,5.9-3.5,8.5l-156.3,156l156.4,156.4c2.4,2.3,3.3,4.6,3.3,8s-1,5.9-3.4,8.5l-21.5,21.2c-2.3,2.4-4.6,3.3-8,3.3C301.2,419.9,298.9,419,296.6,416.7z"/></svg></div>',
                    speed: 350
            };

            // Gallery initialization
            lightGallery(element, options);
        }
    }
});
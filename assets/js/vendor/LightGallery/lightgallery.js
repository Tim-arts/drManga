import * as Sentry from '@sentry/browser';

/** Polyfill the CustomEvent() constructor functionality in Internet Explorer 9 and higher */
(function() {
    if (typeof window.CustomEvent === 'function') {
        return false;
    }

    function CustomEvent(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };
        let evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

window.lgData = {
    uid: 0
};

window.lgModules = {};
let defaults = {
    mode: 'lg-slide',

    // Ex : 'ease'
    cssEasing: 'ease',

    //'for jquery animation'
    easing: 'linear',
    speed: 600,
    height: '100%',
    width: '100%',
    addClass: '',
    startClass: 'lg-start-zoom',
    backdropDuration: 150,
    hideBarsDelay: 6000,
    count: null,
    useLeft: false,
    history: false,
    pills: null,
    cost: null,
    unlocked: null,

    closable: true,
    loop: true,
    escKey: true,
    keyPress: true,
    controls: true,
    slideEndAnimatoin: true,
    hideControlOnEnd: false,
    mousewheel: false,
    thumbDestroy: false,

    getCaptionFromTitleOrAlt: true,

    // .lg-item || '.lg-sub-html'
    appendSubHtmlTo: '.lg-sub-html',

    subHtmlSelectorRelative: false,

    /**
     * @desc number of preload slides
     * will exicute only after the current slide is fully loaded.
     *
     * @ex you clicked on 4th image and if preload = 1 then 3rd slide and 5th
     * slide will be loaded in the background after the 4th slide is fully loaded..
     * if preload is 2 then 2nd 3rd 5th 6th slides will be preloaded.. ... ...
     *
     */
    preload: 1,
    showAfterLoad: true,
    selector: '',
    selectWithin: '',
    nextHtml: '',
    prevHtml: '',

    // 0, 1
    index: false,

    iframeMaxWidth: '100%',

    download: true,
    counter: true,
    appendCounterTo: '.lg-toolbar',

    swipeThreshold: 50,
    enableSwipe: true,
    enableDrag: true,

    dynamic: false,
    dynamicEl: [],
    galleryId: 1,
    buttons: true
};

function Plugin(element, options) {
    // Current lightGallery element
    this.el = element;

    // lightGallery settings
    this.s = {...defaults, ...options};

    // When using dynamic mode, ensure dynamicEl is an array
    if (this.s.dynamic && this.s.dynamicEl !== 'undefined' && this.s.dynamicEl.constructor === Array && !this.s.dynamicEl.length) {
        throw ('When using dynamic mode, you must also define dynamicEl as an Array.');
    }

    // lightGallery options
    this.options = options;

    // Pattern url
    this.pattern = this.el.getAttribute('data-pattern') || options.pattern;

    // User pills
    this.pills = options.pills;

    // Page cost
    this.cost = options.cost;

    // Number of slides unlocked by the user
    this.unlocked = options.unlocked;

    // lightGallery modules
    this.modules = {};

    // false until lightgallery complete first slide;
    this.lgGalleryOn = false;

    this.lgProcessing = true;

    this.lgBusy = false;

    // Timeout function for hiding controls;
    this.hideBartimeout = false;

    // To determine browser supports for touch events;
    this.isTouch = ('ontouchstart' in document.documentElement);

    // Disable hideControlOnEnd if sildeEndAnimation is true
    if (this.s.slideEndAnimatoin) {
        this.s.hideControlOnEnd = false;
    }

    // Fill items
    this.items = this.getItems();

    // .lg-item
    this.___slide = '';

    // .lg-outer
    this.outer = '';

    this.init();
}

Plugin.prototype.init = function() {
    let _this = this;

    // s.preload should not be more than $item.length
    if (_this.s.preload > _this.items.length) {
        _this.s.preload = _this.items.length;
    }

    // if dynamic option is enabled execute immediately
    let _hash = window.location.hash;
    if (_hash.indexOf('lg=' + this.s.galleryId) > -1) {
        _this.index = parseInt(_hash.split('&slide=')[1], 10);

        window.utils.addClass(document.body, 'lg-from-hash');

        if (!window.utils.hasClass(document.body, 'lg-on')) {
            window.utils.addClass(document.body, 'lg-on');

            setTimeout(function() {
                _this.build(_this.index);
            });
        }
    }

    if (_this.s.dynamic) {
        window.utils.trigger(this.el, 'onBeforeOpen');
        _this.index = _this.s.index || 0;

        // prevent accidental double execution
        if (!window.utils.hasClass(document.body, 'lg-on')) {
            window.utils.addClass(document.body, 'lg-on');
            setTimeout(function() {
                _this.build(_this.index);
            });
        }
    } else {
        for (let i = 0; i < _this.items.length; i++) {
            /*jshint loopfunc: true */
            (function(index) {
                // Using different namespace for click because click event should not unbind if selector is same object('this')
                if (!window.utils.hasReferenceEvents(_this.items[index], 'click.lgcustom')) {
                    window.utils.on(_this.items[index], 'click.lgcustom', (e) => {
                        e.preventDefault();

                        window.utils.trigger(_this.el, 'onBeforeOpen');
                        _this.index = _this.s.index || index;

                        if (!window.utils.hasClass(document.body, 'lg-on')) {
                            _this.build(_this.index);
                            window.utils.addClass(document.body, 'lg-on');
                        }
                    });
                }
            })(i);
        }
    }

};

Plugin.prototype.build = function(index) {
    let _this = this;

    _this.structure();

    for (let key in window.lgModules) {
        _this.modules[key] = new window.lgModules[key](_this.el);
    }

    // initiate slide function
    _this.slide(index, false, false);

    _this.applyEvents();
    _this.counter();
    _this.closeGallery();

    window.utils.trigger(_this.el, 'onAfterOpen');

    // Hide controllers if mouse doesn't move for some period
    if (!window.utils.hasReferenceEvents(_this.outer, 'mousemove.lg click.lg touchstart.lg')) {
        window.utils.on(_this.outer, 'mousemove.lg click.lg touchstart.lg', function () {
            window.utils.removeClass(_this.outer, 'lg-hide-items');

            clearTimeout(_this.hideBartimeout);

            // Timeout will be cleared on each slide movement also
            _this.hideBartimeout = setTimeout(function() {
                window.utils.addClass(_this.outer, 'lg-hide-items');
            }, _this.s.hideBarsDelay);
        });
    }
};

Plugin.prototype.applyEvents = function() {
    let _this = this;

    if (this.s.keyPress) {
        this.keyPress();
    }

    if (this.items.length > 1 || this.s.dynamic) {
        this.arrow();

        setTimeout(function() {
            _this.enableDrag();
            _this.enableSwipe();
        }, 50);

        if (this.s.mousewheel) {
            this.mousewheel();
        }
    }
};

Plugin.prototype.structure = function() {
    let list = '';
    let controls = '';
    let i;
    let subHtmlCont = '';
    let template;
    let _this = this;

    document.body.insertAdjacentHTML('beforeend', '<div class="lg-backdrop"></div>');
    window.utils.setVendor(document.querySelector('.lg-backdrop'), 'TransitionDuration', this.s.backdropDuration + 'ms');

    // Create gallery items
    for (i = 0; i < this.items.length; i++) {
        list += '<div class="lg-item"></div>';
    }

    // Create controlls
    if ((this.s.controls && this.items.length > 1) || this.s.dynamic) {
        controls = '<div class="lg-actions">' +
            '<div class="lg-prev lg-icon">' + this.s.prevHtml + '</div>' +
            '<div class="lg-next lg-icon">' + this.s.nextHtml + '</div>' +
            '</div>';
    }

    if (this.s.appendSubHtmlTo === '.lg-sub-html') {
        subHtmlCont = '<div class="lg-sub-html"></div>';
    }

    template = '<div class="lg-outer ' + this.s.addClass + ' ' + this.s.startClass + '">' +
        '<div class="lg" style="width:' + this.s.width + '; height:' + this.s.height + '">' +
        '<div class="lg-inner">' + list + '</div>' +
        '<div class="lg-toolbar group">' +
        '<span class="lg-close lg-icon"></span>' +
        '</div>' +
        controls +
        subHtmlCont +
        '</div>' +
        '</div>';

    document.body.insertAdjacentHTML('beforeend', template);
    this.outer = document.querySelector('.lg-outer');
    this.___slide = Array.from(this.outer.querySelectorAll('.lg-item'));

    if (this.s.useLeft) {
        window.utils.addClass(this.outer, 'lg-use-left');

        // Set mode lg-slide if use left is true;
        this.s.mode = 'lg-slide';
    } else {
        window.utils.addClass(this.outer, 'lg-use-css3');
    }

    // For fixed height gallery
    _this.setTop();
    window.utils.on(window, 'resize.lg orientationchange.lg', function() {
        setTimeout(function() {
            _this.setTop();
        }, 100);
    });

    // add class lg-current to remove initial transition
    window.utils.addClass(this.___slide[this.index], 'lg-current');

    // add Class for css support and transition mode
    if (this.doCss()) {
        window.utils.addClass(this.outer, 'lg-css3');
    } else {
        window.utils.addClass(this.outer, 'lg-css');

        // Set speed 0 because no animation will happen if browser doesn't support css3
        this.s.speed = 0;
    }

    window.utils.addClass(this.outer, this.s.mode);

    if (this.s.enableDrag && this.items.length > 1) {
        window.utils.addClass(this.outer, 'lg-grab');
    }

    if (this.s.showAfterLoad) {
        window.utils.addClass(this.outer, 'lg-show-after-load');
    }

    if (this.doCss()) {
        let inner = this.outer.querySelector('.lg-inner');
        window.utils.setVendor(inner, 'TransitionTimingFunction', this.s.cssEasing);
        window.utils.setVendor(inner, 'TransitionDuration', this.s.speed + 'ms');
    }

    setTimeout(function() {
        window.utils.addClass(document.querySelector('.lg-backdrop'), 'in');
    });


    setTimeout(function() {
        window.utils.addClass(_this.outer, 'lg-visible');
    }, this.s.backdropDuration);

    if (this.s.download) {
        this.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', '<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>');
    }

    // Store the current scroll top value to scroll back after closing the gallery..
    this.prevScrollTop = (document.documentElement.scrollTop || document.body.scrollTop)
};

// For fixed height gallery
Plugin.prototype.setTop = function() {
    if (this.s.height !== '100%') {
        let wH = window.innerHeight;
        let top = (wH - parseInt(this.s.height, 10)) / 2;
        let lgGallery = this.outer.querySelector('.lg');
        if (wH >= parseInt(this.s.height, 10)) {
            lgGallery.style.top = top + 'px';
        } else {
            lgGallery.style.top = '0px';
        }
    }
};

// Find css3 support
Plugin.prototype.doCss = function() {
    // check for css animation support
    let support = function() {
        let transition = ['transition', 'MozTransition', 'WebkitTransition', 'OTransition', 'msTransition', 'KhtmlTransition'];
        let root = document.documentElement;
        let i;
        for (i = 0; i < transition.length; i++) {
            if (transition[i] in root.style) {
                return true;
            }
        }
    };

    return support();
};

/**
 *  @desc Check the given src is video
 *  @param {String} src
 *  @param {Integer} index
 *  @return {Object} video type
 *  Ex:{ youtube  :  ["//www.youtube.com/watch?v=c0asJgSyxcY", "c0asJgSyxcY"] }
 */
Plugin.prototype.isVideo = function(src, index) {
    let html;
    if (this.s.dynamic) {
        html = this.s.dynamicEl[index].html;
    } else {
        html = this.items[index].getAttribute('data-html');
    }

    if (!src && html) {
        return {
            html5: true
        };
    }

    let youtube = src.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i);
    let vimeo = src.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i);
    let dailymotion = src.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i);
    let vk = src.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);

    if (youtube) {
        return {
            youtube: youtube
        };
    } else if (vimeo) {
        return {
            vimeo: vimeo
        };
    } else if (dailymotion) {
        return {
            dailymotion: dailymotion
        };
    } else if (vk) {
        return {
            vk: vk
        };
    }
};

/**
 *  @desc Create image counter
 *  Ex: 1/10
 */
Plugin.prototype.counter = function() {
    if (this.s.counter) {
        this.outer.querySelector(this.s.appendCounterTo).insertAdjacentHTML('beforeend', '<div id="lg-counter"><span id="lg-counter-current">' + (this.index + 1) + '</span> / <span id="lg-counter-all">' + this.options.count + '</span></div>');
    }
};

/**
 *  @desc add sub-html into the slide
 *  @param {Number} index - index of the slide
 */
Plugin.prototype.addHtml = function(index) {
    let subHtml = null;
    let currentEle;

    if (this.s.dynamic) {
        subHtml = this.s.dynamicEl[index].subHtml;
    } else {
        currentEle = this.items[index];
        subHtml = currentEle.getAttribute('data-sub-html');
        if (this.s.getCaptionFromTitleOrAlt && !subHtml) {
            subHtml = currentEle.getAttribute('title');
            if (subHtml && currentEle.querySelector('img')) {
                subHtml = currentEle.querySelector('img').getAttribute('alt');
            }
        }
    }

    if (typeof subHtml !== 'undefined' && subHtml !== null) {
        // get first letter of subhtml
        // if first letter starts with . or # get the html form the jQuery object
        let fL = subHtml.substring(0, 1);
        if (fL === '.' || fL === '#') {
            if (this.s.subHtmlSelectorRelative && !this.s.dynamic) {
                subHtml = currentEle.querySelector(subHtml).innerHTML;
            } else {
                subHtml = document.querySelector(subHtml).innerHTML;
            }
        }
    } else {
        subHtml = '';
    }

    if (this.s.appendSubHtmlTo === '.lg-sub-html') {
        this.outer.querySelector(this.s.appendSubHtmlTo).innerHTML = subHtml;
    } else {
        this.___slide[index].insertAdjacentHTML('beforeend', subHtml);
    }

    // Add lg-empty-html class if title doesn't exist
    if (typeof subHtml !== 'undefined' && subHtml !== null) {
        if (subHtml === '') {
            window.utils.addClass(this.outer.querySelector(this.s.appendSubHtmlTo), 'lg-empty-html');
        } else {
            window.utils.removeClass(this.outer.querySelector(this.s.appendSubHtmlTo), 'lg-empty-html');
        }
    }

    window.utils.trigger(this.el, 'onAfterAppendSubHtml', {
        index: index
    });
};

/**
 *  @desc Preload slides
 *  @param {Number} index - index of the slide
 */
Plugin.prototype.preload = function(index) {
    let i;
    let j;

    for (i = 1; i <= this.s.preload; i++) {
        if (i >= this.items.length - index) {
            break;
        }

        this.loadContent(index + i, false, 0);
    }

    for (j = 1; j <= this.s.preload; j++) {
        if ((index - j) < 0) {
            break;
        }

        this.loadContent(index - j, false, 0);
    }
};

/**
 *  @desc Load slide content into slide.
 *  @param {Number} index - index of the slide.
 *  @param {Boolean} rec - if true call loadcontent() function again.
 *  @param {Boolean} delay - delay for adding complete class. it is 0 except first time.
 */
Plugin.prototype.loadContent = function(index, rec, delay) {
    let _this = this;
    let _hasPoster = false;
    let _img;
    let _src;
    let _poster;
    let _srcset;
    let _sizes;
    let _html;
    let getResponsiveSrc = function(srcItms) {
        let rsWidth = [];
        let rsSrc = [];
        for (let i = 0; i < srcItms.length; i++) {
            let __src = srcItms[i].split(' ');

            // Manage empty space
            if (__src[0] === '') {
                __src.splice(0, 1);
            }

            rsSrc.push(__src[0]);
            rsWidth.push(__src[1]);
        }

        let wWidth = window.innerWidth;
        for (let j = 0; j < rsWidth.length; j++) {
            if (parseInt(rsWidth[j], 10) > wWidth) {
                _src = rsSrc[j];
                break;
            }
        }
    };

    if (_this.s.dynamic) {
        if (_this.s.dynamicEl[index].poster) {
            _hasPoster = true;
            _poster = _this.s.dynamicEl[index].poster;
        }

        _html = _this.s.dynamicEl[index].html;
        _src = _this.s.dynamicEl[index].src;

        if (_this.s.dynamicEl[index].responsive) {
            let srcDyItms = _this.s.dynamicEl[index].responsive.split(',');
            getResponsiveSrc(srcDyItms);
        }

        _srcset = _this.s.dynamicEl[index].srcset;
        _sizes = _this.s.dynamicEl[index].sizes;

    } else {
        if (_this.items[index].getAttribute('data-poster')) {
            _hasPoster = true;
            _poster = _this.items[index].getAttribute('data-poster');
        }

        _html = _this.items[index].getAttribute('data-html');
        _src = _this.items[index].getAttribute('href') || _this.items[index].getAttribute('data-src');

        if (_this.items[index].getAttribute('data-responsive')) {
            let srcItms = _this.items[index].getAttribute('data-responsive').split(',');
            getResponsiveSrc(srcItms);
        }

        _srcset = _this.items[index].getAttribute('data-srcset');
        _sizes = _this.items[index].getAttribute('data-sizes');
    }

    //if (_src || _srcset || _sizes || _poster) {

    let iframe = false;

    if (_this.s.dynamic) {
        if (_this.s.dynamicEl[index].iframe) {
            iframe = true;
        }
    } else {
        if (_this.items[index].getAttribute('data-iframe') === 'true') {
            iframe = true;
        }
    }

    let _isVideo = _this.isVideo(_src, index);
    if (!window.utils.hasClass(_this.___slide[index], 'lg-loaded')) {
        if (iframe) {
            _this.___slide[index].insertAdjacentHTML('afterbegin', '<div class="lg-video-cont" style="max-width:' + _this.s.iframeMaxWidth + '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' + _src + '"  allowfullscreen="true"></iframe></div></div>');
        } else if (_hasPoster) {
            let videoClass = '';
            if (_isVideo && _isVideo.youtube) {
                videoClass = 'lg-has-youtube';
            } else if (_isVideo && _isVideo.vimeo) {
                videoClass = 'lg-has-vimeo';
            } else {
                videoClass = 'lg-has-html5';
            }

            _this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-video-cont ' + videoClass + ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' + _poster + '" /></div></div>');
        } else if (_isVideo) {
            _this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-video-cont "><div class="lg-video"></div></div>');
            window.utils.trigger(_this.el, 'hasVideo', {
                index: index,
                src: _src,
                html: _html
            });
        } else {
            _this.___slide[index].insertAdjacentHTML('beforeend', '<div class="lg-img-wrap"><img class="lg-object lg-image" src="' + _src + '" /></div>');
        }

        window.utils.trigger(_this.el, 'onAfterAppendSlide', {
            index: index
        });

        _img = _this.___slide[index].querySelector('.lg-object');
        if (_sizes) {
            _img.setAttribute('sizes', _sizes);
        }

        if (_srcset) {
            _img.setAttribute('srcset', _srcset);
            try {
                picturefill({
                    elements: [_img[0]]
                });
            } catch (e) {
                console.error('Make sure you have included Picturefill version 2');
            }
        }

        if (this.s.appendSubHtmlTo !== '.lg-sub-html') {
            _this.addHtml(index);
        }

        window.utils.addClass(_this.___slide[index], 'lg-loaded');
    }

    // Check if the element already has bound events to avoid events stacking
    if (!window.utils.hasReferenceEvents(_this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg')) {
        window.utils.on(_this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg', function() {
            // For first time add some delay for displaying the start animation.
            let _speed = 0;

            // Do not change the delay value because it is required for zoom plugin.
            // If gallery opened from direct url (hash) speed value should be 0
            if (delay && !window.utils.hasClass(document.body, 'lg-from-hash')) {
                _speed = delay;
            }

            setTimeout(function() {
                window.utils.addClass(_this.___slide[index], 'lg-complete');

                window.utils.trigger(_this.el, 'onSlideItemLoad', {
                    index: index,
                    delay: delay || 0
                }, function () {
                    _this.lgProcessing = false;
                });
            }, _speed);
        });

        if (rec === true) {
            if (!window.utils.hasClass(_this.___slide[index], 'lg-complete')) {
                window.utils.on(_this.___slide[index].querySelector('.lg-object'), 'load.lg error.lg', function() {
                    _this.preload(index);
                });
            } else {
                _this.preload(index);
            }
        }
    }

    // @todo check load state for html5 videos
    if (_isVideo && _isVideo.html5 && !_hasPoster) {
        window.utils.addClass(_this.___slide[index], 'lg-complete');
    }
};

/**
 *   @desc slide function for lightgallery
 ** Slide() gets call on start
 ** ** Set lg.on true once slide() function gets called.
 ** Call loadContent() on slide() function inside setTimeout
 ** ** On first slide we do not want any animation like slide of fade
 ** ** So on first slide(if lg.on if false that is first slide) loadContent() should start loading immediately
 ** ** Else loadContent() should wait for the transition to complete.
 ** ** So set timeout s.speed + 50
 <=> ** loadContent() will load slide content into the particular slide
 ** ** It has recursion (rec) parameter. if rec === true loadContent() will call preload() function.
 ** ** preload will execute only when the previous slide is fully loaded (images iframe)
 ** ** avoid simultaneous image load
 <=> ** Preload() will check for s.preload value and call loadContent() again according to preload value
 ** loadContent()  <====> Preload();

 *   @param {Number} index - index of the slide
 *   @param {Boolean} fromTouch - True if slide function called via touch event or mouse drag
 *   @param {Boolean} fromThumb - True if slide function called via thumbnail click
 *   @param {Boolean} add - Append a new slide inside the gallery
 */
Plugin.prototype.slide = function (index, fromTouch, fromThumb, add) {
    let _this = this,
        _prevIndex = 0,
        slidesContainer = document.querySelector('.lg-inner');

    // Append new item
    if (add) {
        let item = document.createElement('div');
        item.className = 'lg-item';

        this.___slide.push(item);
        slidesContainer.insertAdjacentElement('beforeend', item);
    }

    for (let i = 0; i < this.___slide.length; i++) {
        if (window.utils.hasClass(this.___slide[i], 'lg-current')) {
            _prevIndex = i;
            break;
        }
    }

    // Prevent if multiple call
    // Required for hash plugin
    if (_this.lgGalleryOn && (_prevIndex === index)) {
        return;
    }

    let _length = this.___slide.length;
    let _time = _this.lgGalleryOn ? this.s.speed : 0;
    let _next = false;
    let _prev = false;

    if (!_this.lgBusy) {
        if (this.s.download) {
            let _src;
            if (_this.s.dynamic) {
                _src = _this.s.dynamicEl[index].downloadUrl !== false && (_this.s.dynamicEl[index].downloadUrl || _this.s.dynamicEl[index].src);
            } else {
                _src = _this.items[index].getAttribute('data-download-url') !== 'false' && (_this.items[index].getAttribute('data-download-url') || _this.items[index].getAttribute('href') || _this.items[index].getAttribute('data-src'));
            }

            if (_src) {
                document.getElementById('lg-download').setAttribute('href', _src);
                window.utils.removeClass(_this.outer, 'lg-hide-download');
            } else {
                window.utils.addClass(_this.outer, 'lg-hide-download');
            }
        }

        window.utils.trigger(_this.el, 'onBeforeSlide', {
            prevIndex: _prevIndex,
            index: index,
            fromTouch: fromTouch,
            fromThumb: fromThumb
        });

        _this.lgBusy = true;

        clearTimeout(_this.hideBartimeout);

        // Add title if this.s.appendSubHtmlTo === lg-sub-html
        if (this.s.appendSubHtmlTo === '.lg-sub-html') {

            // wait for slide animation to complete
            setTimeout(function() {
                _this.addHtml(index);
            }, _time);
        }

        this.arrowDisable(index);

        if (!fromTouch) {
            // remove all transitions
            window.utils.addClass(_this.outer, 'lg-no-trans');

            for (let j = 0; j < this.___slide.length; j++) {
                window.utils.removeClass(this.___slide[j], 'lg-prev-slide');
                window.utils.removeClass(this.___slide[j], 'lg-next-slide');
            }

            if (index < _prevIndex) {
                _prev = true;

                // if ((index === 0) && (_prevIndex === _length - 1) && !fromThumb) {
                //     _prev = false;
                //     _next = true;
                // }
            } else {
                _next = true;

                // if ((index === _length - 1) && (_prevIndex === 0) && !fromThumb && !add) {
                //     _prev = true;
                //     _next = false;
                // }
            }

            if (_prev) {
                //prevslide
                window.utils.addClass(this.___slide[index], 'lg-prev-slide');
                window.utils.addClass(this.___slide[_prevIndex], 'lg-next-slide');
            } else if (_next) {
                // next slide
                window.utils.addClass(this.___slide[index], 'lg-next-slide');
                window.utils.addClass(this.___slide[_prevIndex], 'lg-prev-slide');
            }

            // give 50 ms for browser to add/remove class
            setTimeout(function() {
                window.utils.removeClass(_this.outer.querySelector('.lg-current'), 'lg-current');

                //_this.$slide.eq(_prevIndex).removeClass('lg-current');
                window.utils.addClass(_this.___slide[index], 'lg-current');

                // reset all transitions
                window.utils.removeClass(_this.outer, 'lg-no-trans');
            }, 50);
        } else {
            let touchPrev = index - 1;
            let touchNext = index + 1;

            if (((index === 0) && (_prevIndex === _length - 1)) || ((index === _length - 1) && (_prevIndex === 0))) {
                // next slide
                touchNext = 0;
                touchPrev = _length - 1;
            }

            window.utils.removeClass(_this.outer.querySelector('.lg-prev-slide'), 'lg-prev-slide');
            window.utils.removeClass(_this.outer.querySelector('.lg-current'), 'lg-current');
            window.utils.removeClass(_this.outer.querySelector('.lg-next-slide'), 'lg-next-slide');
            window.utils.addClass(_this.___slide[touchPrev], 'lg-prev-slide');
            window.utils.addClass(_this.___slide[touchNext], 'lg-next-slide');
            window.utils.addClass(_this.___slide[index], 'lg-current');
        }

        if (_this.lgGalleryOn) {
            // Speed + 50
            _this.loadContent(index, true, 0);
            _this.lgBusy = false;

            // Speed
            window.utils.trigger(_this.el, 'onAfterSlide', {
                prevIndex: _prevIndex,
                index: index,
                fromTouch: fromTouch,
                fromThumb: fromThumb
            });
        } else {
            _this.loadContent(index, true, _this.s.backdropDuration);
            _this.lgBusy = false;

            window.utils.trigger(_this.el, 'onAfterSlide', {
                prevIndex: _prevIndex,
                index: index,
                fromTouch: fromTouch,
                fromThumb: fromThumb
            });
        }

        _this.lgGalleryOn = true;
        _this.incrementCounter(index);
    }
};

/**
 *   @desc incrementCounter function for lightgallery
 **  Increment the counter displays at the top right of the screen
 *   @param {Number} index - Index of the slide
 */
Plugin.prototype.incrementCounter = function (index) {
    if (this.s.counter) {
        if (document.getElementById('lg-counter-current')) {
            document.getElementById('lg-counter-current').innerHTML = index + 1;
        }
    }
};

/**
 *   @desc proceedToNextSlide function for lightgallery
 **  When called, switch to the next slide
 *   @param {Number} index - index of the slide
 *   @param {Boolean=} fromTouch - True if slide function called via touch event or mouse drag
 *   @param {Boolean=} add - Append a new slide inside the gallery
 */
Plugin.prototype.proceedToNextSlide = function (index, fromTouch, add) {
    let _this = this;

    if (!_this.lgBusy) {
        if (index <= _this.s.count) {
            _this.index++;

            window.utils.trigger(_this.el, 'onBeforeNextSlide', {
                index: _this.index
            });

            _this.slide(_this.index, fromTouch, false, add);
        } else {
            if (_this.s.loop) {
                _this.index = 0;

                window.utils.trigger(_this.el, 'onBeforeNextSlide', {
                    index: _this.index
                });

                _this.slide(_this.index, fromTouch, false, add);
            } else if (_this.s.slideEndAnimatoin) {
                window.utils.addClass(_this.outer, 'lg-right-end');

                setTimeout(function() {
                    window.utils.removeClass(_this.outer, 'lg-right-end');
                }, _this.s.speed);
            }
        }
    }
};

/**
 *   @desc proceedToPrevSlide function for lightgallery
 **  When called, switch to the previous slide
 *   @param {Number} index - index of the slide
 *   @param {Boolean} fromTouch - True if slide function called via touch event or mouse drag
 *   @param {Boolean=} add - Optional - Append a new slide inside the gallery
 */
Plugin.prototype.proceedToPrevSlide = function (index, fromTouch, add) {
    let _this = this;

    if (!_this.lgBusy) {
        if (_this.index > 0) {
            _this.index--;

            window.utils.trigger(_this.el, 'onBeforePrevSlide', {
                index: _this.index,
                fromTouch: fromTouch
            });

            _this.slide(_this.index, fromTouch, false, add);
        } else {
            if (_this.s.loop) {
                _this.index = _this.items.length - 1;

                window.utils.trigger(_this.el, 'onBeforePrevSlide', {
                    index: _this.index,
                    fromTouch: fromTouch
                });

                _this.slide(_this.index, fromTouch, false, add);
            } else if (_this.s.slideEndAnimatoin) {
                window.utils.addClass(_this.outer, 'lg-left-end');

                setTimeout(function() {
                    window.utils.removeClass(_this.outer, 'lg-left-end');
                }, _this.s.speed);
            }
        }
    }
};

/**
 *   @desc goToNextSlide function for lightgallery
 **  Allows to implement others controls before switching slide
 *   @param {Boolean} fromTouch - True if slide function called via touch event
 */
Plugin.prototype.goToNextSlide = function (fromTouch) {
    let _this = this,
        nextIndex = _this.index + 2;

    // Avoid multiple calls when gallery is loading
    if (this.lgBusy || this.lgProcessing || !this.atLeastOneImageIsLoaded()) {
        return;
    }

    // If the user reached the end of the manga
    if (nextIndex > _this.s.count) {
        // To display the bounce effect
        _this.proceedToNextSlide(nextIndex, fromTouch);

        $.toast({
            heading: window.utils.lang === 'fr' ? 'Félicitations !' : 'Congratulations!',
            text: window.utils.lang === 'fr' ? 'Vous êtes arrivé(e) au bout du manga !' : 'You just finished the manga!',
            showHideTransition: 'fade',
            icon: 'success',
            hideAfter: 3000,
            stack: false
        });

        return;
    }

    // Block the user if he can't unlock the next page
    if (this.unlocked === (this.index + 1) && (this.pills < this.cost)) {
        $.toast({
            text: window.utils.lang === 'fr' ? 'Vous n\'avez pas assez de pilules pour débloquer la page suivante !' : 'You don\'t have enough pills to unlock the next page!',
            showHideTransition: 'fade',
            icon: 'error',
            hideAfter: 3000,
            stack: false
        });

        return;
    }

    if (!_this.isImageAlreadyStored(nextIndex)) {
        _this.requestImage(nextIndex, fromTouch);
        _this.lgProcessing = true;
    } else {
        _this.proceedToNextSlide(nextIndex, fromTouch);
    }
};

/**
 *   @desc goToPrevSlide function for lightgallery
 **  Allows to implement others controls before switching slide
 *   @param {Boolean} fromTouch - True if slide function called via touch event
 */
Plugin.prototype.goToPrevSlide = function (fromTouch) {
    let _this = this,
        prevIndex = _this.index;

    // If gallery is processing
    if (this.lgBusy || this.lgProcessing || !this.atLeastOneImageIsLoaded()) {
        return;
    }

    // Avoid multiple calls when gallery is loading
    if (prevIndex === 0) {
        _this.proceedToPrevSlide(prevIndex, fromTouch);

        return;
    }

    // Load previous image not loaded
    if (!_this.isImageAlreadyStored(prevIndex) && _this.isImageLoaded(prevIndex)) {
        let baseUrl = this.el.getAttribute('data-pattern'),
            url = baseUrl.substring(0, baseUrl.length - (baseUrl.split('/').pop().length));
        url = url + prevIndex--;

        // Replace the url
        paths[prevIndex] = url;
        _this.items[prevIndex].src = url;
        _this.items[prevIndex].thumb = url;
        _this.items[prevIndex].default = false;
        _this.proceedToPrevSlide(prevIndex, fromTouch);

        // Delay execution to wait the container image that loads
        // Update slide and thumbnail
        setTimeout(function () {
            _this.___slide[prevIndex].querySelector('.lg-image').src = url;
            // window.utils.trigger(_this.el, 'updateThumbnail', {index: prevIndex, src: url});
        }, _this.s.speed + (_this.s.speed / 2));

        _this.lgProcessing = true;
    } else {
        _this.proceedToPrevSlide(prevIndex, fromTouch);
    }
};

/**
 *   @desc getItems function for lightgallery
 **  Runs at the initialization and returns all the urls of the image to construct the gallery
 */
Plugin.prototype.getItems = function () {
    let items = [];

    if (this.s.dynamic) {
        items = this.s.dynamicEl;
    } else {
        if (this.s.selector === 'this') {
            items.push(this.el);
        } else if (this.s.selector !== '') {
            if (this.s.selectWithin) {
                items = document.querySelector(this.s.selectWithin).querySelectorAll(this.s.selector);
            } else {
                items = this.el.querySelectorAll(this.s.selector);
            }
        } else {
            items = this.el.children;
        }
    }

    return items;
};

/**
 *   @desc hasUnlockedPage function for lightgallery
 **  Verify the user has unlocked or has enough pills to slide to the next page
 */
Plugin.prototype.hasUnlockedPage = function () {
    return this.index + 1 < this.unlocked;
};

/**
 *   @desc requestImage function for lightgallery
 **  AJAX request used to generally load the previous or the next image according to the given index
 *   @param {Number} index - True if slide function called via touch event
 *   @param {Boolean} fromTouch - True if slide function called via touch event
 */
Plugin.prototype.requestImage = function (index, fromTouch) {
    let _this = this,
        pattern = _this.pattern,
        url = `${pattern.substring(0, pattern.length - (pattern.split('/').pop().length))}${index}`;

    $.post({
        url : url,
        type : 'GET',
        success: function (response) {
            if (response.success) {
                let item = {
                    downloadUrl: false,
                    src: url,
                    thumb: url,
                    default: false
                };

                paths.push(url);
                _this.items.push(item);

                if (!_this.hasUnlockedPage(index)) {
                    _this.pills--;
                }

                _this.proceedToNextSlide(index, fromTouch, true);
                _this.updateUnlocked(index);

                // Update the visual counter
                window.utils.trigger(_this.el, 'onButtonCounterUpdate', {pills: Number(response.pills)});

                // Update the gallery
                // Speed
                _this.update();
            }
        },
        error : function (response, status, error) {
            console.log(response);
            console.log(status);
            console.log(error);
        },
    });
};

/**
 *   @desc update function for lightgallery
 **  Update events and changes from the new slide
 */
Plugin.prototype.update = function () {
    let _this = this;

    _this.clearEvents();

    // _this.modules.thumbnail.update();

    _this.modules.zoom.destroy();
    _this.modules.zoom.init(true);

    _this.applyEvents();
};

/**
 *   @desc update function for lightgallery
 **  Avoid stack events by detaching events
 */
Plugin.prototype.clearEvents = function () {
    for (let i = 0, count = this.___slide.length; i < count; i++) {
        window.utils.off(this.___slide[i], '.lg');
    }

    window.utils.off(window, '.lg');
    window.utils.off(this.el, '.lgtm', 'onBeforeSlide');
};

Plugin.prototype.updateUnlocked = function (index) {
    if (this.unlocked < index) {
        this.unlocked = index;
    }
};

/**
 *   @desc isImageLoaded function for lightgallery
 **  Returns an indication about an image and allows to know if the image has been already
 *   loaded or if the image is a placeholder
 *   @param {Number} index - True if slide function called via touch event
 */
Plugin.prototype.isImageLoaded = function (index) {
    return this.items[index - 1].default;
};

/**
 *   @desc isImageAlreadyStored function for lightgallery
 *   Recreate an image's url with the index passed as parameter and returns
 *   an indication as to know if the variable "paths" already contains this url
 *   @param {Number} index - True if slide function called via touch event
 */
Plugin.prototype.isImageAlreadyStored = function (index) {
    let url = this.el.getAttribute('data-pattern'),
        nextUrl = url.substring(0, url.length - (url.split('/').pop().length));

    return paths.includes(`${nextUrl}${index}`);
};

/**
 *   @desc atLeastOneImageIsLoaded function for lightgallery
 *   Lets know about if at least one of the image has been already loaded inside the gallery
 */
Plugin.prototype.atLeastOneImageIsLoaded = function () {
    let items = Array.from(this.outer.querySelectorAll('.lg-item'));

    for (let index in items) {
        if (items[index].classList.contains('lg-loaded')) {
            return true;
        }
    }

    return false;
};

Plugin.prototype.keyPress = function () {
    let _this = this,
        fired = false;

    if (this.items.length > 1 || this.s.dynamic) {
        window.utils.on(window, 'keyup.lg', (e) => {
            let keyCode = e.keyCode || e.which;

            if (e.repeat) {
                return;
            }

            if (keyCode === 37) {
                e.preventDefault();
                _this.goToPrevSlide();
            }

            if (keyCode === 39) {
                e.preventDefault();
                _this.goToNextSlide();
            }

            if (keyCode === 37 || keyCode === 39) {
                fired = false;
            }
        });
    }

    window.utils.on(window, 'keydown.lg', (e) => {
        if (_this.s.escKey === true && e.keyCode === 27) {
            e.preventDefault();

            if (!window.utils.hasClass(_this.outer, 'lg-thumb-open') && _this.s.thumbDestroy) {
                _this.destroy();
            } else {
                window.utils.removeClass(_this.outer, 'lg-thumb-open');
            }
        }

        if(!fired) {
            fired = true;
        }
    });
};

Plugin.prototype.arrow = function() {
    let _this = this;

    if (!window.utils.hasReferenceEvents(this.outer.querySelector('.lg-prev'), 'click.lg')) {
        window.utils.on(this.outer.querySelector('.lg-prev'), 'click.lg', function () {
            _this.goToPrevSlide();
        });
    }

    if (!window.utils.hasReferenceEvents(this.outer.querySelector('.lg-next'), 'click.lg')) {
        window.utils.on(this.outer.querySelector('.lg-next'), 'click.lg', function() {
            _this.goToNextSlide();
        });
    }
};

Plugin.prototype.arrowDisable = function(index) {
    // Disable arrows if s.hideControlOnEnd is true
    if (!this.s.loop && this.s.hideControlOnEnd) {
        let next = this.outer.querySelector('.lg-next');
        let prev = this.outer.querySelector('.lg-prev');
        if ((index + 1) < this.___slide.length) {
            next.removeAttribute('disabled');
            window.utils.removeClass(next, 'disabled');
        } else {
            next.setAttribute('disabled', 'disabled');
            window.utils.addClass(next, 'disabled');
        }

        if (index > 0) {
            prev.removeAttribute('disabled');
            window.utils.removeClass(prev, 'disabled');
        } else {
            prev.setAttribute('disabled', 'disabled');
            window.utils.addClass(prev, 'disabled');
        }
    }
};

Plugin.prototype.setTranslate = function(el, xValue, yValue) {
    // jQuery supports Automatic CSS prefixing since jQuery 1.8.0
    if (this.s.useLeft) {
        el.style.left = xValue;
    } else {
        window.utils.setVendor(el, 'Transform', 'translate3d(' + (xValue) + 'px, ' + yValue + 'px, 0px)');
    }
};

Plugin.prototype.touchMove = function(startCoords, endCoords) {
    let distance = endCoords - startCoords;

    if (Math.abs(distance) > 15) {
        // reset opacity and transition duration
        window.utils.addClass(this.outer, 'lg-dragging');

        // move current slide
        this.setTranslate(this.___slide[this.index], distance, 0);

        // move next and prev slide with current slide
        this.setTranslate(document.querySelector('.lg-prev-slide'), -this.___slide[this.index].clientWidth + distance, 0);
        this.setTranslate(document.querySelector('.lg-next-slide'), this.___slide[this.index].clientWidth + distance, 0);
    }
};

Plugin.prototype.touchEnd = function(distance) {
    let _this = this;

    // keep slide animation for any mode while dragg/swipe
    if (_this.s.mode !== 'lg-slide') {
        window.utils.addClass(_this.outer, 'lg-slide');
    }

    for (let i = 0; i < this.___slide.length; i++) {
        if (!window.utils.hasClass(this.___slide[i], 'lg-current') && !window.utils.hasClass(this.___slide[i], 'lg-prev-slide') && !window.utils.hasClass(this.___slide[i], 'lg-next-slide')) {
            this.___slide[i].style.opacity = '0';
        }
    }

    // set transition duration
    setTimeout(function() {
        window.utils.removeClass(_this.outer, 'lg-dragging');
        if ((distance < 0) && (Math.abs(distance) > _this.s.swipeThreshold)) {
            _this.goToNextSlide(true);
        } else if ((distance > 0) && (Math.abs(distance) > _this.s.swipeThreshold)) {
            _this.goToPrevSlide(true);
        } else if (Math.abs(distance) < 5) {

            // Trigger click if distance is less than 5 pix
            window.utils.trigger(_this.el, 'onSlideClick');
        }

        for (let i = 0; i < _this.___slide.length; i++) {
            _this.___slide[i].removeAttribute('style');
        }
    });

    // remove slide class once drag/swipe is completed if mode is not slide
    setTimeout(function() {
        if (!window.utils.hasClass(_this.outer, 'lg-dragging') && _this.s.mode !== 'lg-slide') {
            window.utils.removeClass(_this.outer, 'lg-slide');
        }
    }, _this.s.speed + 100);

};

Plugin.prototype.enableSwipe = function() {
    if (!this.s.enableSwipe || !this.s.isTouch) {
        return;
    }

    let _this = this;
    let startCoords = 0;
    let endCoords = 0;
    let isMoved = false;

    if (_this.doCss()) {
        for (let i = 0; i < _this.___slide.length; i++) {
            if (!window.utils.hasReferenceEvents(_this.___slide[i], 'touchstart.lg')) {
                window.utils.on(_this.___slide[i], 'touchstart.lg', function (e) {
                    if (!window.utils.hasClass(_this.outer, 'lg-zoomed') && !_this.lgBusy) {
                        e.preventDefault();
                        _this.manageSwipeClass();
                        startCoords = e.targetTouches[0].pageX;
                    }
                });
            }
        }

        for (let j = 0; j < _this.___slide.length; j++) {
            if (!window.utils.hasReferenceEvents(_this.___slide[j], 'touchmove.lg')) {
                window.utils.on(_this.___slide[j], 'touchmove.lg', function (e) {
                    if (!window.utils.hasClass(_this.outer, 'lg-zoomed')) {
                        e.preventDefault();
                        endCoords = e.targetTouches[0].pageX;
                        _this.touchMove(startCoords, endCoords);
                        isMoved = true;
                    }
                });
            }
        }

        for (let k = 0; k < _this.___slide.length; k++) {
            if (!window.utils.hasReferenceEvents(_this.___slide[k], 'touchend.lg')) {
                window.utils.on(_this.___slide[k], 'touchend.lg', function () {
                    if (!window.utils.hasClass(_this.outer, 'lg-zoomed')) {
                        if (isMoved) {
                            isMoved = false;
                            _this.touchEnd(endCoords - startCoords);
                        } else {
                            window.utils.trigger(_this.el, 'onSlideClick');
                        }
                    }
                });
            }
        }
    }
};

Plugin.prototype.enableDrag = function() {
    let _this = this;
    let startCoords = 0;
    let endCoords = 0;
    let isDraging = false;
    let isMoved = false;

    if (_this.s.enableDrag && !_this.isTouch && _this.doCss()) {
        for (let i = 0; i < _this.___slide.length; i++) {
            if (!window.utils.hasReferenceEvents(_this.___slide[i], 'mousedown.lg')) {
                window.utils.on(_this.___slide[i], 'mousedown.lg', function (e) {
                    // execute only on .lg-object
                    if (!window.utils.hasClass(_this.outer, 'lg-zoomed')) {
                        if (window.utils.hasClass(e.target, 'lg-object') || window.utils.hasClass(e.target, 'lg-video-play')) {
                            e.preventDefault();

                            if (!_this.lgBusy) {
                                _this.manageSwipeClass();
                                startCoords = e.pageX;
                                isDraging = true;

                                // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                                _this.outer.scrollLeft += 1;
                                _this.outer.scrollLeft -= 1;

                                // *

                                window.utils.removeClass(_this.outer, 'lg-grab');
                                window.utils.addClass(_this.outer, 'lg-grabbing');

                                window.utils.trigger(_this.el, 'onDragstart');
                            }

                        }
                    }
                });
            }
        }

        window.utils.on(window, 'mousemove.lg', function(e) {
            if (isDraging) {
                isMoved = true;
                endCoords = e.pageX;
                _this.touchMove(startCoords, endCoords);
                window.utils.trigger(_this.el, 'onDragmove');
            }
        });

        window.utils.on(window, 'mouseup.lg', function(e) {
            if (isMoved) {
                isMoved = false;
                _this.touchEnd(endCoords - startCoords);
                window.utils.trigger(_this.el, 'onDragend');
            } else if (window.utils.hasClass(e.target, 'lg-object') || window.utils.hasClass(e.target, 'lg-video-play')) {
                window.utils.trigger(_this.el, 'onSlideClick');
            }

            // Prevent execution on click
            if (isDraging) {
                isDraging = false;
                window.utils.removeClass(_this.outer, 'lg-grabbing');
                window.utils.addClass(_this.outer, 'lg-grab');
            }
        });
    }
};

Plugin.prototype.manageSwipeClass = function() {
    let touchNext = this.index + 1;
    let touchPrev = this.index - 1;
    let length = this.___slide.length;
    if (this.s.loop) {
        if (this.index === 0) {
            touchPrev = length - 1;
        } else if (this.index === length - 1) {
            touchNext = 0;
        }
    }

    for (let i = 0; i < this.___slide.length; i++) {
        window.utils.removeClass(this.___slide[i], 'lg-next-slide');
        window.utils.removeClass(this.___slide[i], 'lg-prev-slide');
    }

    if (touchPrev > -1) {
        window.utils.addClass(this.___slide[touchPrev], 'lg-prev-slide');
    }

    window.utils.addClass(this.___slide[touchNext], 'lg-next-slide');
};

Plugin.prototype.mousewheel = function() {
    let _this = this;

    if (!window.utils.hasReferenceEvents(_this.outer, 'mousewheel.lg')) {
        window.utils.on(_this.outer, 'mousewheel.lg', function (e) {
            if (!e.deltaY) {
                return;
            }

            if (e.deltaY > 0) {
                _this.goToPrevSlide();
            } else {
                _this.goToNextSlide();
            }

            e.preventDefault();
        });
    }
};

Plugin.prototype.closeGallery = function() {
    let _this = this,
        mousedown = false;

    if (!window.utils.hasReferenceEvents(this.outer.querySelector('.lg-close'), 'click.lg')) {
        window.utils.on(this.outer.querySelector('.lg-close'), 'click.lg', function () {
            _this.destroy();
        });
    }

    if (_this.s.closable) {
        // If you drag the slide and release outside gallery gets close on chrome
        // for preventing this check mousedown and mouseup happened on .lg-item or lg-outer
        window.utils.on(_this.outer, 'mousedown.lg', function(e) {
            mousedown = !!(window.utils.hasClass(e.target, 'lg-outer') || window.utils.hasClass(e.target, 'lg-item') || window.utils.hasClass(e.target, 'lg-img-wrap'));
        });

        window.utils.on(_this.outer, 'mouseup.lg', function(e) {
            if (window.utils.hasClass(e.target, 'lg-outer') || window.utils.hasClass(e.target, 'lg-item') || window.utils.hasClass(e.target, 'lg-img-wrap') && mousedown) {
                if (!window.utils.hasClass(_this.outer, 'lg-dragging')) {
                    _this.destroy();
                }
            }
        });
    }
};

Plugin.prototype.destroy = function(d) {
    let _this = this;

    if (!d) {
        window.utils.trigger(_this.el, 'onBeforeClose');
    }

    document.body.scrollTop = _this.prevScrollTop;
    document.documentElement.scrollTop = _this.prevScrollTop;

    /**
     * if d is false or undefined destroy will only close the gallery
     * plugins instance remains with the element
     *
     * if d is true destroy will completely remove the plugin
     */

    if (d) {
        if (!_this.s.dynamic) {
            // only when not using dynamic mode is $items a jquery collection

            for (let i = 0; i < this.items.length; i++) {
                window.utils.off(this.items[i], '.lg');
                window.utils.off(this.items[i], '.lgcustom');
            }
        }

        let lguid = _this.el.getAttribute('lg-uid');
        delete window.lgData[lguid];
        _this.el.removeAttribute('lg-uid');
    }

    // Unbind all events added by lightGallery
    window.utils.off(this.el, '.lgtm');

    // Distroy all lightGallery modules
    for (let key in window.lgModules) {
        if (_this.modules[key]) {
            _this.modules[key].destroy(d);
        }
    }

    this.lgGalleryOn = false;

    clearTimeout(_this.hideBartimeout);
    this.hideBartimeout = false;
    window.utils.off(window, '.lg');
    window.utils.removeClass(document.body, 'lg-on');
    window.utils.removeClass(document.body, 'lg-from-hash');

    if (_this.outer) {
        window.utils.removeClass(_this.outer, 'lg-visible');
    }

    window.utils.removeClass(document.querySelector('.lg-backdrop'), 'in');
    setTimeout(function() {
        try {
            if (_this.outer) {
                _this.outer.parentNode.removeChild(_this.outer);
            }

            if (document.querySelector('.lg-backdrop')) {
                document.querySelector('.lg-backdrop').parentNode.removeChild(document.querySelector('.lg-backdrop'));
            }

            if (!d) {
                window.utils.trigger(_this.el, 'onCloseAfter');
            }
        } catch (err) {}
    }, _this.s.backdropDuration + 50);
};

window.lightGallery = function(el, options) {
    if (!el) {
        return;
    }

    let gallery, uid;

    try {
        if (!el.getAttribute('lg-uid')) {
            uid = 'lg' + window.lgData.uid++;
            gallery = window.lgData[uid] = new Plugin(el, options);
            el.setAttribute('lg-uid', uid);
        } else {
            try {
                window.lgData[el.getAttribute('lg-uid')].init();
            } catch (err) {
                console.error('lightGallery has not initiated properly');
            }
        }
    } catch (err) {
        console.error('lightGallery has not initiated properly');
        Sentry.captureException(err);
    }

    // Allows the developer to use the internal object
    return gallery;
};
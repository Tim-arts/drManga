import utils from "./lg-utils";

/**!
 * lg-thumbnail.js | 1.0.0 | August 8th 2018
 * http://sachinchoolur.github.io/lg-thumbnail.js
 * Copyright (c) 2016 Sachin N; 
 * @license GPLv3 
 */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{let g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LgThumbnail = f()}})(function(){let define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){let c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);let a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}let p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){let n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(let u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports !== "undefined") {
        factory();
    } else {
        let mod = {
            exports: {}
        };
        factory();
        global.lgThumbnail = mod.exports;
    }
})(this, function () {
    'use strict';

    let _extends = Object.assign || function (target) {
        for (let i = 1; i < arguments.length; i++) {
            let source = arguments[i];

            for (let key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    let thumbnailDefaults = {
        thumbnail: true,

        animateThumb: true,
        currentPagerPosition: 'middle',

        thumbWidth: 100,
        thumbContHeight: 100,
        thumbMargin: 5,

        exThumbImage: false,
        showThumbByDefault: true,
        toggleThumb: true,
        pullCaptionUp: true,

        enableThumbDrag: true,
        enableThumbSwipe: true,
        swipeThreshold: 50,

        loadYoutubeThumbnail: true,
        youtubeThumbSize: 1,

        loadVimeoThumbnail: true,
        vimeoThumbSize: 'thumbnail_small',

        loadDailymotionThumbnail: true
    };

    let Thumbnail = function Thumbnail(element) {
        this.el = element;

        this.core = window.lgData[this.el.getAttribute('lg-uid')];
        this.core.s = _extends({}, thumbnailDefaults, this.core.s);

        this.thumbOuter = null;
        this.thumbOuterWidth = 0;
        this.thumbTotalWidth = this.core.items.length * (this.core.s.thumbWidth + this.core.s.thumbMargin);
        this.thumbIndex = this.core.index;
        this.thumblist = '';
        this.vimeoErrorThumbSize = '';
        this.thumbItems = null;
        
        // Thumbnail animation value
        this.left = 0;

        this.init();

        return this;
    };

    Thumbnail.prototype.init = function () {
        let _this = this;

        if (this.core.s.thumbnail && this.core.items.length > 1 || this.core.s.dynamic) {
            if (this.core.s.showThumbByDefault) {
                setTimeout(function () {
                    window.utils.addClass(_this.core.outer, 'lg-thumb-open');
                }, 700);
            }

            if (this.core.s.pullCaptionUp) {
                window.utils.addClass(this.core.outer, 'lg-pull-caption-up');
            }

            this.build();
            if (this.core.s.animateThumb) {
                if (this.core.s.enableThumbDrag && !this.core.isTouch && this.core.doCss()) {
                    this.enableThumbDrag();
                }

                if (this.core.s.enableThumbSwipe && this.core.isTouch && this.core.doCss()) {
                    this.enableThumbSwipe();
                }

                this.thumbClickable = false;
            } else {
                this.thumbClickable = true;
            }

            this.toggle();
            this.thumbkeyPress();
        }
    };

    Thumbnail.prototype.build = function () {
        let _this = this;
        let html = '<div class="lg-thumb-outer">' + '<div class="lg-thumb group">' + '</div>' + '</div>';

        switch (this.core.s.vimeoThumbSize) {
            case 'thumbnail_large':
                _this.vimeoErrorThumbSize = '640';
                break;
            case 'thumbnail_medium':
                _this.vimeoErrorThumbSize = '200x150';
                break;
            case 'thumbnail_small':
                _this.vimeoErrorThumbSize = '100x75';
        }

        window.utils.addClass(_this.core.outer, 'lg-has-thumb');

        _this.core.outer.querySelector('.lg').insertAdjacentHTML('beforeend', html);

        _this.thumbOuter = _this.core.outer.querySelector('.lg-thumb-outer');
        _this.thumbOuterWidth = _this.thumbOuter.offsetWidth;

        if (_this.core.s.animateThumb) {
            _this.core.outer.querySelector('.lg-thumb').style.width = _this.thumbTotalWidth + 'px';
            _this.core.outer.querySelector('.lg-thumb').style.position = 'relative';
        }

        if (this.core.s.animateThumb) {
            _this.thumbOuter.style.height = _this.core.s.thumbContHeight + 'px';
        }

        this.updateThumbnails();

        this.thumbItems = _this.core.outer.querySelectorAll('.lg-thumb-item');

        for (let n = 0; n < this.thumbItems.length; n++) {
            /*jshint loopfunc: true */
            (function (index) {
                let $this = _this.thumbItems[index];
                let vimeoVideoId = $this.getAttribute('data-vimeo-id');
                if (vimeoVideoId) {

                    window['lgJsonP' + _this.el.getAttribute('lg-uid') + '' + n] = function (content) {
                        $this.querySelector('img').setAttribute('src', content[0][_this.core.s.vimeoThumbSize]);
                    };

                    let script = document.createElement('script');
                    script.className = 'lg-script';
                    script.src = '//www.vimeo.com/api/v2/video/' + vimeoVideoId + '.json?callback=lgJsonP' + _this.el.getAttribute('lg-uid') + '' + n;
                    document.body.appendChild(script);
                }
            })(n);
        }

        // Manage active class for thumbnail
        window.utils.addClass(_this.thumbItems[_this.core.index], 'active');

        if (!window.utils.hasReferenceEvents(_this.core.el, 'onBeforeSlide.lgtm')) {
            window.utils.on(_this.core.el, 'onBeforeSlide.lgtm', function () {
                for (let j = 0; j < _this.thumbItems.length; j++) {
                    window.utils.removeClass(_this.thumbItems[j], 'active');
                }

                window.utils.addClass(_this.thumbItems[_this.core.index], 'active');
                _this.animateThumb(_this.core.index);
            });
        }

        this.updateEvents();

        window.utils.on(window, 'resize.lgthumb orientationchange.lgthumb', function () {
            setTimeout(function () {
                _this.animateThumb(_this.core.index);
                _this.thumbOuterWidth = _this.thumbOuter.offsetWidth;
            }, 200);
        });

        if (!window.utils.hasReferenceEvents(_this.core.el, 'updateThumbnail.lgthumb')) {
            window.utils.on(_this.core.el, 'updateThumbnail.lgthumb', function (data) {
                _this.thumbItems[data.detail.index].querySelector('img').src = data.detail.src;
                _this.thumbItems = _this.core.outer.querySelectorAll('.lg-thumb-item');
                _this.updateThumbnails(true);
            });
        }
    };

    Thumbnail.prototype.resetActiveClass = function () {
        let _this = this;

        for (let j = 0; j < _this.thumbItems.length; j++) {
            window.utils.removeClass(_this.thumbItems[j], 'active');
        }

        _this.thumblist = _this.thumbOuter.querySelector('.lg-thumb.group').innerHTML;
    };

    Thumbnail.prototype.updateActiveClass = function () {
        let _this = this;

        _this.resetActiveClass();

        if (!window.utils.hasReferenceEvents(_this.core.el, 'onBeforeSlide.lgtm')) {
            window.utils.on(_this.core.el, 'onBeforeSlide.lgtm', function () {
                for (let j = 0; j < _this.thumbItems.length; j++) {
                    window.utils.removeClass(_this.thumbItems[j], 'active');
                }

                window.utils.addClass(_this.thumbItems[_this.core.index], 'active');
            });
        }

        window.utils.trigger(this.core.el, 'onBeforeSlide.lgtm');
        window.utils.addClass(this.thumbItems[this.core.index], 'active');

        this.updateEvents();
    };

    Thumbnail.prototype.updateEvents = function () {
        let _this = this;

        for (let k = 0; k < _this.thumbItems.length; k++) {
            /*jshint loopfunc: true */
            (function (index) {
                if (!window.utils.hasReferenceEvents(_this.thumbItems[index], 'click.lg touchend.lg')) {
                    window.utils.on(_this.thumbItems[index], 'click.lg touchend.lg', function () {
                        setTimeout(function () {
                            if (_this.core.items[index].default) {
                                return;
                            }

                            // In IE9 and bellow touch does not support
                            // Go to slide if browser does not support css transitions
                            if (_this.thumbClickable && !_this.core.lgBusy || !_this.core.doCss()) {
                                _this.core.index = index;
                                _this.core.slide(_this.core.index, false, true);
                            }
                        }, 50);
                    });
                }
            })(k);
        }
    };

    Thumbnail.prototype.updateThumbnails = function (forced) {
        let _this = this;

        if (forced) {
            _this.thumblist = _this.thumbOuter.querySelector('.lg-thumb.group').innerHTML;

            return;
        }

        if (_this.core.s.dynamic) {
            for (let j = 0; j < _this.core.s.dynamicEl.length; j++) {
                _this.appendToThumbList(_this.core.s.dynamicEl[j].src, _this.core.s.dynamicEl[j].thumb, j);
            }
        } else {
            for (let i = 0; i < _this.core.items.length; i++) {
                if (!_this.core.s.exThumbImage) {
                    _this.appendToThumbList(_this.core.items[i].getAttribute('href') || _this.core.items[i].getAttribute('data-src'), _this.core.items[i].querySelector('img').getAttribute('src'), i);
                } else {
                    _this.appendToThumbList(_this.core.items[i].getAttribute('href') || _this.core.items[i].getAttribute('data-src'), _this.core.items[i].getAttribute(_this.core.s.exThumbImage), i);
                }
            }
        }

        _this.core.outer.querySelector('.lg-thumb').innerHTML = _this.thumblist;
    };

    Thumbnail.prototype.addNewThumbnail = function () {
        let index = this.core.s.dynamicEl.length - 1,
            element = this.core.s.dynamicEl[index];

        this.appendToThumbList(element.src, element.thumb, index);
        this.core.outer.querySelector('.lg-thumb').innerHTML = this.thumblist;
        this.thumbItems = this.core.outer.querySelectorAll('.lg-thumb-item');
    };

    Thumbnail.prototype.appendToThumbList = function (src, thumb, index) {
        let _this = this,
            isVideo = _this.core.isVideo(src, index) || {},
            thumbImg,
            vimeoId = '';

        if (isVideo.youtube || isVideo.vimeo || isVideo.dailymotion) {
            if (isVideo.youtube) {
                if (_this.core.s.loadYoutubeThumbnail) {
                    thumbImg = '//img.youtube.com/vi/' + isVideo.youtube[1] + '/' + _this.core.s.youtubeThumbSize + '.jpg';
                } else {
                    thumbImg = thumb;
                }
            } else if (isVideo.vimeo) {
                if (_this.core.s.loadVimeoThumbnail) {
                    thumbImg = '//i.vimeocdn.com/video/error_' + _this.vimeoErrorThumbSize + '.jpg';
                    vimeoId = isVideo.vimeo[1];
                } else {
                    thumbImg = thumb;
                }
            } else if (isVideo.dailymotion) {
                if (_this.core.s.loadDailymotionThumbnail) {
                    thumbImg = '//www.dailymotion.com/thumbnail/video/' + isVideo.dailymotion[1];
                } else {
                    thumbImg = thumb;
                }
            }
        } else {
            thumbImg = thumb;
        }

        _this.thumblist += '<div data-vimeo-id="' + vimeoId + '" class="lg-thumb-item" style="width:' + _this.core.s.thumbWidth + 'px; margin-right: ' + _this.core.s.thumbMargin + 'px"><img src="' + thumbImg + '" /></div>';
    };

    Thumbnail.prototype.setTranslate = function (value) {
        window.utils.setVendor(this.core.outer.querySelector('.lg-thumb'), 'Transform', 'translate3d(-' + value + 'px, 0px, 0px)');
    };

    Thumbnail.prototype.animateThumb = function (index) {
        let $thumb = this.core.outer.querySelector('.lg-thumb');
        if (this.core.s.animateThumb) {
            let position;
            switch (this.core.s.currentPagerPosition) {
                case 'left':
                    position = 0;
                    break;
                case 'middle':
                    position = this.thumbOuterWidth / 2 - this.core.s.thumbWidth / 2;
                    break;
                case 'right':
                    position = this.thumbOuterWidth - this.core.s.thumbWidth;
            }
            this.left = (this.core.s.thumbWidth + this.core.s.thumbMargin) * index - 1 - position;
            if (this.left > this.thumbTotalWidth - this.thumbOuterWidth) {
                this.left = this.thumbTotalWidth - this.thumbOuterWidth;
            }

            if (this.left < 0) {
                this.left = 0;
            }

            if (this.core.lGalleryOn) {
                if (!window.utils.hasClass($thumb, 'on')) {
                    window.utils.setVendor(this.core.outer.querySelector('.lg-thumb'), 'TransitionDuration', this.core.s.speed + 'ms');
                }

                if (!this.core.doCss()) {
                    $thumb.style.left = -this.left + 'px';
                }
            } else {
                if (!this.core.doCss()) {
                    $thumb.style.left = -this.left + 'px';
                }
            }

            this.setTranslate(this.left);
        }
    };

    // Enable thumbnail dragging and swiping
    Thumbnail.prototype.enableThumbDrag = function () {
        let _this = this;
        let startCoords = 0;
        let endCoords = 0;
        let isDraging = false;
        let isMoved = false;
        let tempLeft = 0;

        window.utils.addClass(_this.thumbOuter, 'lg-grab');

        if (!window.utils.hasReferenceEvents(_this.core.outer.querySelector('.lg-thumb'), 'mousedown.lgthumb')) {
            window.utils.on(_this.core.outer.querySelector('.lg-thumb'), 'mousedown.lgthumb', function (e) {
                if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
                    // execute only on .lg-object
                    e.preventDefault();
                    startCoords = e.pageX;
                    isDraging = true;

                    // ** Fix for webkit cursor issue https://code.google.com/p/chromium/issues/detail?id=26723
                    _this.core.outer.scrollLeft += 1;
                    _this.core.outer.scrollLeft -= 1;

                    // *
                    _this.thumbClickable = false;
                    window.utils.removeClass(_this.thumbOuter, 'lg-grab');
                    window.utils.addClass(_this.thumbOuter, 'lg-grabbing');
                }
            });
        }

        window.utils.on(window, 'mousemove.lgthumb', function (e) {
            if (isDraging) {
                tempLeft = _this.left;
                isMoved = true;
                endCoords = e.pageX;

                window.utils.addClass(_this.thumbOuter, 'lg-dragging');

                tempLeft = tempLeft - (endCoords - startCoords);

                if (tempLeft > _this.thumbTotalWidth - _this.thumbOuterWidth) {
                    tempLeft = _this.thumbTotalWidth - _this.thumbOuterWidth;
                }

                if (tempLeft < 0) {
                    tempLeft = 0;
                }

                // move current slide
                _this.setTranslate(tempLeft);
            }
        });

        window.utils.on(window, 'mouseup.lgthumb', function () {
            if (isMoved) {
                isMoved = false;
                window.utils.removeClass(_this.thumbOuter, 'lg-dragging');

                _this.left = tempLeft;

                if (Math.abs(endCoords - startCoords) < _this.core.s.swipeThreshold) {
                    _this.thumbClickable = true;
                }
            } else {
                _this.thumbClickable = true;
            }

            if (isDraging) {
                isDraging = false;
                window.utils.removeClass(_this.thumbOuter, 'lg-grabbing');
                window.utils.addClass(_this.thumbOuter, 'lg-grab');
            }
        });
    };

    Thumbnail.prototype.enableThumbSwipe = function () {
        let _this = this;
        let startCoords = 0;
        let endCoords = 0;
        let isMoved = false;
        let tempLeft = 0;

        if (!window.utils.hasReferenceEvents(_this.core.outer.querySelector('.lg-thumb'), 'touchstart.lg')) {
            window.utils.on(_this.core.outer.querySelector('.lg-thumb'), 'touchstart.lg', function (e) {
                if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
                    e.preventDefault();
                    startCoords = e.targetTouches[0].pageX;
                    _this.thumbClickable = false;
                }
            });
        }

        if (!window.utils.hasReferenceEvents(_this.core.outer.querySelector('.lg-thumb'), 'touchmove.lg')) {
            window.utils.on(_this.core.outer.querySelector('.lg-thumb'), 'touchmove.lg', function (e) {
                if (_this.thumbTotalWidth > _this.thumbOuterWidth) {
                    e.preventDefault();
                    endCoords = e.targetTouches[0].pageX;
                    isMoved = true;

                    window.utils.addClass(_this.thumbOuter, 'lg-dragging');

                    tempLeft = _this.left;

                    tempLeft = tempLeft - (endCoords - startCoords);

                    if (tempLeft > _this.thumbTotalWidth - _this.thumbOuterWidth) {
                        tempLeft = _this.thumbTotalWidth - _this.thumbOuterWidth;
                    }

                    if (tempLeft < 0) {
                        tempLeft = 0;
                    }

                    // move current slide
                    _this.setTranslate(tempLeft);
                }
            });
        }

        if (!window.utils.hasReferenceEvents(_this.core.outer.querySelector('.lg-thumb'), 'touchend.lg')) {
            window.utils.on(_this.core.outer.querySelector('.lg-thumb'), 'touchend.lg', function () {
                if (_this.thumbTotalWidth > _this.thumbOuterWidth) {

                    if (isMoved) {
                        isMoved = false;
                        window.utils.removeClass(_this.thumbOuter, 'lg-dragging');
                        if (Math.abs(endCoords - startCoords) < _this.core.s.swipeThreshold) {
                            _this.thumbClickable = true;
                        }

                        _this.left = tempLeft;
                    } else {
                        _this.thumbClickable = true;
                    }
                } else {
                    _this.thumbClickable = true;
                }
            });
        }
    };

    Thumbnail.prototype.toggle = function () {
        let _this = this;
        if (_this.core.s.toggleThumb) {
            window.utils.addClass(_this.core.outer, 'lg-can-toggle');
            _this.thumbOuter.insertAdjacentHTML('beforeend', '<span class="lg-toggle-thumb lg-icon"></span>');

            if (!window.utils.hasReferenceEvents(_this.core.outer.querySelector('.lg-toggle-thumb'), 'click.lg')) {
                window.utils.on(_this.core.outer.querySelector('.lg-toggle-thumb'), 'click.lg', function () {
                    if (window.utils.hasClass(_this.core.outer, 'lg-thumb-open')) {
                        window.utils.removeClass(_this.core.outer, 'lg-thumb-open');
                    } else {
                        window.utils.addClass(_this.core.outer, 'lg-thumb-open');
                    }
                });
            }
        }
    };

    Thumbnail.prototype.thumbkeyPress = function () {
        let _this = this;

        window.utils.on(window, 'keydown.lgthumb', function (e) {
            if (e.keyCode === 38) {
                e.preventDefault();
                window.utils.addClass(_this.core.outer, 'lg-thumb-open');
            } else if (e.keyCode === 40) {
                e.preventDefault();
                window.utils.removeClass(_this.core.outer, 'lg-thumb-open');
            }
        });
    };

    Thumbnail.prototype.update = function () {
        let _this = this;
        this.thumbTotalWidth = this.core.items.length * (this.core.s.thumbWidth + this.core.s.thumbMargin);

        if (_this.core.s.animateThumb) {
            _this.core.outer.querySelector('.lg-thumb').style.width = _this.thumbTotalWidth + 'px';
        }

        this.addNewThumbnail();
        this.updateActiveClass();
        this.animateThumb(this.core.s.index);

        // Update removed event
        if (!window.utils.hasReferenceEvents(_this.core.el, 'onBeforeSlide.lgtm')) {
            window.utils.on(_this.core.el, 'onBeforeSlide.lgtm', function () {
                _this.animateThumb(_this.core.index);
            });
        }
    };

    Thumbnail.prototype.destroy = function (d) {
        if (this.core.s.thumbnail && this.core.items.length > 1) {
            window.utils.off(window, '.lgthumb');
            if (!d) {
                this.thumbOuter.parentNode.removeChild(this.thumbOuter);
            }
            window.utils.removeClass(this.core.outer, 'lg-has-thumb');

            let lgScript = document.getElementsByClassName('lg-script');
            while (lgScript[0]) {
                lgScript[0].parentNode.removeChild(lgScript[0]);
            }
        }
    };

    window.lgModules.thumbnail = Thumbnail;
});

},{}]},{},[1])(1)
});

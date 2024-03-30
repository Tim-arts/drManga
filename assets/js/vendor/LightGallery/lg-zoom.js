/**!
 * lg-zoom.js | 1.0.1 | December 22nd 2016
 * http://sachinchoolur.github.io/lg-zoom.js
 * Copyright (c) 2016 Sachin N;
 * @license GPLv3
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{let g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LgZoom = f()}})(function(){let define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){let a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);let f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}let l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){let n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}let i=typeof require=="function"&&require;for(let o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
                global.lgZoom = mod.exports;
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

            let getUseLeft = function getUseLeft() {
                let useLeft = false;
                let isChrome = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
                if (isChrome && parseInt(isChrome[2], 10) < 54) {
                    useLeft = true;
                }

                return useLeft;
            };

            let zoomDefaults = {
                scale: 1,
                zoom: true,
                actualSize: true,
                enableZoomAfter: 300,
                useLeftForZoom: getUseLeft()
            };

            let mobileDetection = function() {
                let check = false;
                (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
                return check;
            };

            let Zoom = function Zoom(element) {
                this.el = element;

                this.core = window.lgData[this.el.getAttribute('lg-uid')];
                this.core.s = _extends({}, zoomDefaults, this.core.s);

                if (this.core.s.zoom && this.core.doCss()) {
                    this.init();

                    // Store the zoomable timeout value just to clear it while closing
                    this.zoomabletimeout = false;

                    // Set the initial value center
                    this.pageX = window.innerWidth / 2;
                    this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
                }

                return this;
            };

            Zoom.prototype.init = function (refresh) {
                let _this = this,
                    frLangage = window.utils.lang === 'fr';

                if (!refresh) {
                    let zoomInTitle = frLangage ? 'Zoom avant' : 'Zoom in',
                        zoomOutTitle = frLangage ? 'Zoom arrière' : 'Zoom out';

                    let zoomIcons = '<span id="lg-zoom-in" class="lg-icon d-none d-md-block" title="' + zoomInTitle + '"></span><span id="lg-zoom-out" class="lg-icon d-none d-md-block" title="' + zoomOutTitle + '"></span>';

                    if (_this.core.s.actualSize) {
                        let zoomActualSizeTitle = frLangage ? 'Zoom 100%' : '100% Zoom';
                        zoomIcons += '<span id="lg-actual-size" class="lg-icon d-none d-md-block" title="' + zoomActualSizeTitle + '"></span>';
                    }

                    if (_this.core.s.useLeftForZoom) {
                        window.utils.addClass(_this.core.outer, 'lg-use-left-for-zoom');
                    } else {
                        window.utils.addClass(_this.core.outer, 'lg-use-transition-for-zoom');
                    }

                    this.core.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', zoomIcons);
                }

                // Add zoomable class
                if (!window.utils.hasReferenceEvents(_this.core.el, 'onSlideItemLoad.lgtmzoom')) {
                    window.utils.on(_this.core.el, 'onSlideItemLoad.lgtmzoom', function (event) {

                        // delay will be 0 except first time
                        let _speed = _this.core.s.enableZoomAfter + event.detail.delay;

                        // set _speed value 0 if gallery opened from direct url and if it is first slide
                        if (window.utils.hasClass(document.body, 'lg-from-hash') && event.detail.delay) {

                            // will execute only once
                            _speed = 0;
                        } else {

                            // Remove lg-from-hash to enable starting animation.
                            window.utils.removeClass(document.body, 'lg-from-hash');
                        }

                        _this.zoomabletimeout = setTimeout(function () {
                            window.utils.addClass(_this.core.___slide[event.detail.index], 'lg-zoomable');
                        }, _speed + 30);
                    });
                }

                let scale = 1;
                /**
                 * @desc Image zoom
                 * Translate the wrap and scale the image to get better user experience
                 *
                 * @param {Number} scaleVal - Zoom decrement/increment value
                 */
                let zoom = function zoom(scaleVal) {
                    let image = _this.core.outer.querySelector('.lg-current .lg-image');
                    let _x;
                    let _y;

                    // Find offset manually to avoid issue after zoom
                    let offsetX = (window.innerWidth - image.clientWidth) / 2;
                    let offsetY = (window.innerHeight - image.clientHeight) / 2 + (document.documentElement.scrollTop || document.body.scrollTop);

                    _x = _this.pageX - offsetX;
                    _y = _this.pageY - offsetY;

                    let x = (scaleVal - 1) * _x;
                    let y = (scaleVal - 1) * _y;

                    window.utils.setVendor(image, 'Transform', 'scale3d(' + scaleVal + ', ' + scaleVal + ', 1)');
                    image.setAttribute('data-scale', String(scaleVal));

                    if (_this.core.s.useLeftForZoom) {
                        image.parentElement.style.left = -x + 'px';
                        image.parentElement.style.top = -y + 'px';
                    } else {
                        window.utils.setVendor(image.parentElement, 'Transform', 'translate3d(-' + x + 'px, -' + y + 'px, 0)');
                    }

                    image.parentElement.setAttribute('data-x', x);
                    image.parentElement.setAttribute('data-y', y);
                };

                let callScale = function callScale() {
                    if (scale > 1) {
                        window.utils.addClass(_this.core.outer, 'lg-zoomed');
                    } else {
                        _this.resetZoom();
                    }

                    if (scale < 1) {
                        scale = 1;
                    }

                    zoom(scale);
                };

                let actualSize = function actualSize(event, image, index, fromIcon) {
                    let w = image.clientWidth;
                    let nw;
                    if (_this.core.s.dynamic) {
                        nw = _this.core.s.dynamicEl[index].width || image.naturalWidth || w;
                    } else {
                        nw = _this.core.items[index].getAttribute('data-width') || image.naturalWidth || w;
                    }

                    let _scale;

                    if (window.utils.hasClass(_this.core.outer, 'lg-zoomed')) {
                        scale = 1;
                    } else {
                        if (nw > w) {
                            _scale = nw / w;
                            scale = _scale || 2;
                        }
                    }

                    if (fromIcon) {
                        _this.pageX = window.innerWidth / 2;
                        _this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
                    } else {
                        _this.pageX = event.pageX || event.touches[0].pageX || event.targetTouches[0].pageX;
                        _this.pageY = event.pageY || event.touches[0].pageY || event.targetTouches[0].pageY;
                    }

                    callScale();
                    setTimeout(function () {
                        window.utils.removeClass(_this.core.outer, 'lg-grabbing');
                        window.utils.addClass(_this.core.outer, 'lg-grab');
                    }, 10);
                };

                let tapped = false;

                // Event triggered after appending slide content
                if (!window.utils.hasReferenceEvents(_this.core.el, 'onAfterAppendSlide.lgtmzoom')) {
                    window.utils.on(_this.core.el, 'onAfterAppendSlide.lgtmzoom', function (event) {

                        let index = event.detail.index;

                        // Get the current element
                        let image = _this.core.___slide[index].querySelector('.lg-image');

                        if (!_this.core.s.isTouch && !mobileDetection()) {
                            window.utils.on(image, 'dblclick', function (event) {
                                actualSize(event, image, index);
                            });
                        }

                        if (_this.core.s.isTouch) {
                            window.utils.on(image, 'touchstart', function (event) {
                                if (!tapped) {
                                    tapped = setTimeout(function () {
                                        tapped = null;
                                    }, 300);
                                } else {
                                    clearTimeout(tapped);
                                    tapped = null;
                                    actualSize(event, image, index);
                                }

                                event.preventDefault();
                            });
                        }
                    });
                }

                // Update zoom on resize and orientationchange
                window.utils.on(window, 'resize.lgzoom scroll.lgzoom orientationchange.lgzoom', function () {
                    _this.pageX = window.innerWidth / 2;
                    _this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
                    zoom(scale);
                });

                if (!window.utils.hasReferenceEvents(document.getElementById('lg-zoom-out'), 'click.lg')) {
                    window.utils.on(document.getElementById('lg-zoom-out'), 'click.lg', function () {
                        if (_this.core.outer.querySelector('.lg-current .lg-image')) {
                            scale -= _this.core.s.scale;
                            callScale();
                        }
                    });
                }

                if (!window.utils.hasReferenceEvents(document.getElementById('lg-zoom-in'), 'click.lg')) {
                    window.utils.on(document.getElementById('lg-zoom-in'), 'click.lg', function () {
                        if (_this.core.outer.querySelector('.lg-current .lg-image')) {
                            scale += _this.core.s.scale;
                            callScale();
                        }
                    });
                }

                if (!window.utils.hasReferenceEvents(document.getElementById('lg-actual-size'), 'click.lg')) {
                    window.utils.on(document.getElementById('lg-actual-size'), 'click.lg', function (event) {
                        actualSize(event, _this.core.___slide[_this.core.index].querySelector('.lg-image'), _this.core.index, true);
                    });
                }

                // Reset zoom on slide change
                if (!window.utils.hasReferenceEvents(_this.core.el, 'onBeforeSlide.lgtm')) {
                    window.utils.on(_this.core.el, 'onBeforeSlide.lgtm', function () {
                        scale = 1;
                        _this.resetZoom();
                    });
                }

                // Drag option after zoom
                if (!_this.core.s.isTouch) {
                    _this.zoomDrag();
                }

                if (_this.core.s.isTouch) {
                    _this.zoomSwipe();
                }
            };

            // Reset zoom effect
            Zoom.prototype.resetZoom = function () {
                window.utils.removeClass(this.core.outer, 'lg-zoomed');
                for (let i = 0; i < this.core.___slide.length; i++) {
                    if (this.core.___slide[i].querySelector('.lg-img-wrap')) {
                        this.core.___slide[i].querySelector('.lg-img-wrap').removeAttribute('style');
                        this.core.___slide[i].querySelector('.lg-img-wrap').removeAttribute('data-x');
                        this.core.___slide[i].querySelector('.lg-img-wrap').removeAttribute('data-y');
                    }
                }

                for (let j = 0; j < this.core.___slide.length; j++) {
                    if (this.core.___slide[j].querySelector('.lg-image')) {
                        this.core.___slide[j].querySelector('.lg-image').removeAttribute('style');
                        this.core.___slide[j].querySelector('.lg-image').removeAttribute('data-scale');
                    }
                }

                // Reset pageX pageY values to center
                this.pageX = window.innerWidth / 2;
                this.pageY = window.innerHeight / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
            };

            Zoom.prototype.zoomSwipe = function () {
                let _this = this;
                let startCoords = {};
                let endCoords = {};
                let isMoved = false;

                // Allow x direction drag
                let allowX = false;

                // Allow Y direction drag
                let allowY = false;

                for (let i = 0; i < _this.core.___slide.length; i++) {
                    if (!window.utils.hasReferenceEvents(_this.core.___slide[i], 'touchstart.lg')) {
                        window.utils.on(_this.core.___slide[i], 'touchstart.lg', function (e) {
                            if (window.utils.hasClass(_this.core.outer, 'lg-zoomed')) {
                                let image = _this.core.___slide[_this.core.index].querySelector('.lg-object');

                                allowY = image.offsetHeight * image.getAttribute('data-scale') > _this.core.outer.querySelector('.lg').clientHeight;
                                allowX = image.offsetWidth * image.getAttribute('data-scale') > _this.core.outer.querySelector('.lg').clientWidth;
                                if (allowX || allowY) {
                                    e.preventDefault();
                                    startCoords = {
                                        x: e.targetTouches[0].pageX,
                                        y: e.targetTouches[0].pageY
                                    };
                                }
                            }
                        });
                    }
                }

                for (let j = 0; j < _this.core.___slide.length; j++) {
                    if (!window.utils.hasReferenceEvents(_this.core.___slide[j], 'touchmove.lg')) {
                        window.utils.on(_this.core.___slide[j], 'touchmove.lg', function (e) {
                            if (window.utils.hasClass(_this.core.outer, 'lg-zoomed')) {
                                let _el = _this.core.___slide[_this.core.index].querySelector('.lg-img-wrap');
                                let distanceX;
                                let distanceY;

                                e.preventDefault();
                                isMoved = true;

                                endCoords = {
                                    x: e.targetTouches[0].pageX,
                                    y: e.targetTouches[0].pageY
                                };

                                // reset opacity and transition duration
                                window.utils.addClass(_this.core.outer, 'lg-zoom-dragging');

                                if (allowY) {
                                    distanceY = -Math.abs(_el.getAttribute('data-y')) + (endCoords.y - startCoords.y);
                                } else {
                                    distanceY = -Math.abs(_el.getAttribute('data-y'));
                                }

                                if (allowX) {
                                    distanceX = -Math.abs(_el.getAttribute('data-x')) + (endCoords.x - startCoords.x);
                                } else {
                                    distanceX = -Math.abs(_el.getAttribute('data-x'));
                                }

                                if (Math.abs(endCoords.x - startCoords.x) > 15 || Math.abs(endCoords.y - startCoords.y) > 15) {

                                    if (_this.core.s.useLeftForZoom) {
                                        _el.style.left = distanceX + 'px';
                                        _el.style.top = distanceY + 'px';
                                    } else {
                                        window.utils.setVendor(_el, 'Transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
                                    }
                                }
                            }
                        });
                    }
                }

                for (let k = 0; k < _this.core.___slide.length; k++) {
                    if (!window.utils.hasReferenceEvents(_this.core.___slide[k], 'touchend')) {
                        window.utils.on(_this.core.___slide[k], 'touchend.lg', function () {
                            if (window.utils.hasClass(_this.core.outer, 'lg-zoomed')) {
                                if (isMoved) {
                                    isMoved = false;
                                    window.utils.removeClass(_this.core.outer, 'lg-zoom-dragging');
                                    _this.touchendZoom(startCoords, endCoords, allowX, allowY);
                                }
                            }
                        });
                    }
                }
            };

            Zoom.prototype.zoomDrag = function () {
                let _this = this;
                let startCoords = {};
                let endCoords = {};
                let isDraging = false;
                let isMoved = false;

                // Allow x direction drag
                let allowX = false;

                // Allow Y direction drag
                let allowY = false;

                for (let i = 0; i < _this.core.___slide.length; i++) {
                    /*jshint loopfunc: true */
                    if (!window.utils.hasReferenceEvents(_this.core.___slide[i], 'mousedown.lgzoom')) {
                        window.utils.on(_this.core.___slide[i], 'mousedown.lgzoom', function (e) {
                            // execute only on .lg-object
                            let image = _this.core.___slide[_this.core.index].querySelector('.lg-object');

                            allowY = image.offsetHeight * image.getAttribute('data-scale') > _this.core.outer.querySelector('.lg').clientHeight;
                            allowX = image.offsetWidth * image.getAttribute('data-scale') > _this.core.outer.querySelector('.lg').clientWidth;

                            if (window.utils.hasClass(_this.core.outer, 'lg-zoomed')) {
                                if (window.utils.hasClass(e.target, 'lg-object') && (allowX || allowY)) {
                                    e.preventDefault();
                                    startCoords = {
                                        x: e.pageX,
                                        y: e.pageY
                                    };

                                    isDraging = true;

                                    window.utils.removeClass(_this.core.outer, 'lg-grab');
                                    window.utils.addClass(_this.core.outer, 'lg-grabbing');
                                }
                            }
                        });
                    }
                }

                window.utils.on(window, 'mousemove.lgzoom', function (e) {
                    if (isDraging) {
                        let _el = _this.core.___slide[_this.core.index].querySelector('.lg-img-wrap');
                        let distanceX;
                        let distanceY;

                        isMoved = true;
                        endCoords = {
                            x: e.pageX,
                            y: e.pageY
                        };

                        // reset opacity and transition duration
                        window.utils.addClass(_this.core.outer, 'lg-zoom-dragging');

                        if (allowY) {
                            distanceY = -Math.abs(Number(_el.getAttribute('data-y'))) + (endCoords.y - startCoords.y);
                        } else {
                            distanceY = -Math.abs(Number(_el.getAttribute('data-y')));
                        }

                        if (allowX) {
                            distanceX = -Math.abs(Number(_el.getAttribute('data-x'))) + (endCoords.x - startCoords.x);
                        } else {
                            distanceX = -Math.abs(Number(_el.getAttribute('data-x')));
                        }

                        if (_this.core.s.useLeftForZoom) {
                            _el.style.left = distanceX + 'px';
                            _el.style.top = distanceY + 'px';
                        } else {
                            window.utils.setVendor(_el, 'Transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
                        }
                    }
                });

                window.utils.on(window, 'mouseup.lgzoom', function (e) {
                    if (isDraging) {
                        isDraging = false;
                        window.utils.removeClass(_this.core.outer, 'lg-zoom-dragging');

                        // Fix for chrome mouse move on click
                        if (isMoved && (startCoords.x !== endCoords.x || startCoords.y !== endCoords.y)) {
                            endCoords = {
                                x: e.pageX,
                                y: e.pageY
                            };

                            _this.touchendZoom(startCoords, endCoords, allowX, allowY);
                        }

                        isMoved = false;
                    }

                    window.utils.removeClass(_this.core.outer, 'lg-grabbing');
                    window.utils.addClass(_this.core.outer, 'lg-grab');
                });
            };

            Zoom.prototype.touchendZoom = function (startCoords, endCoords, allowX, allowY) {
                let _this = this;
                let _el = _this.core.___slide[_this.core.index].querySelector('.lg-img-wrap');
                let image = _this.core.___slide[_this.core.index].querySelector('.lg-object');
                let distanceX = -Math.abs(_el.getAttribute('data-x')) + (endCoords.x - startCoords.x);
                let distanceY = -Math.abs(_el.getAttribute('data-y')) + (endCoords.y - startCoords.y);
                let minY = (_this.core.outer.querySelector('.lg').clientHeight - image.offsetHeight) / 2;
                let maxY = Math.abs(image.offsetHeight * Math.abs(image.getAttribute('data-scale')) - _this.core.outer.querySelector('.lg').clientHeight + minY);
                let minX = (_this.core.outer.querySelector('.lg').clientWidth - image.offsetWidth) / 2;
                let maxX = Math.abs(image.offsetWidth * Math.abs(image.getAttribute('data-scale')) - _this.core.outer.querySelector('.lg').clientWidth + minX);

                if (Math.abs(endCoords.x - startCoords.x) > 15 || Math.abs(endCoords.y - startCoords.y) > 15) {
                    if (allowY) {
                        if (distanceY <= -maxY) {
                            distanceY = -maxY;
                        } else if (distanceY >= -minY) {
                            distanceY = -minY;
                        }
                    }

                    if (allowX) {
                        if (distanceX <= -maxX) {
                            distanceX = -maxX;
                        } else if (distanceX >= -minX) {
                            distanceX = -minX;
                        }
                    }

                    if (allowY) {
                        _el.setAttribute('data-y', Math.abs(distanceY));
                    } else {
                        distanceY = -Math.abs(_el.getAttribute('data-y'));
                    }

                    if (allowX) {
                        _el.setAttribute('data-x', Math.abs(distanceX));
                    } else {
                        distanceX = -Math.abs(_el.getAttribute('data-x'));
                    }

                    if (_this.core.s.useLeftForZoom) {
                        _el.style.left = distanceX + 'px';
                        _el.style.top = distanceY + 'px';
                    } else {
                        window.utils.setVendor(_el, 'Transform', 'translate3d(' + distanceX + 'px, ' + distanceY + 'px, 0)');
                    }
                }
            };

            Zoom.prototype.destroy = function () {
                let _this = this;

                // Unbind all events added by lightGallery zoom plugin
                window.utils.off(_this.core.el, '.lgzoom');
                window.utils.off(window, '.lgzoom');
                for (let i = 0; i < _this.core.___slide.length; i++) {
                    window.utils.off(_this.core.___slide[i], '.lgzoom');
                }

                window.utils.off(_this.core.el, '.lgtmzoom');
                _this.resetZoom();
                clearTimeout(_this.zoomabletimeout);
                _this.zoomabletimeout = false;
            };

            window.lgModules.zoom = Zoom;
        });

    },{}]},{},[1])(1)
});
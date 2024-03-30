/**!
 * lg-fullscreen.js | 1.0.0 | October 5th 2016
 * http://sachinchoolur.github.io/lg-fullscreen.js
 * Copyright (c) 2016 Sachin N;
 * @license GPLv3
 */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{let g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LgFullscreen = f()}})(function(){let define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){let a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);let f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}let l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){let n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}let i=typeof require=="function"&&require;for(let o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
                global.lgFullscreen = mod.exports;
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

            let fullscreenDefaults = {
                fullScreen: true
            };

            let Fullscreen = function Fullscreen(element) {

                this.el = element;

                this.core = window.lgData[this.el.getAttribute('lg-uid')];
                this.core.s = _extends({}, fullscreenDefaults, this.core.s);

                this.init();

                return this;
            };

            Fullscreen.prototype.init = function (update) {
                let fullScreen = '';

                if (update) {
                    return;
                }

                if (this.core.s.fullScreen) {

                    // check for fullscreen browser support
                    if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled && !document.mozFullScreenEnabled && !document.msFullscreenEnabled) {
                        return;
                    } else {
                        let frLangage = window.utils.lang === 'fr';

                        fullScreen = '<span class="lg-fullscreen lg-icon d-none d-md-block" title="' + (frLangage ? "Basculer plein écran" : "Toggle full screen") + '"></span>';
                        this.core.outer.querySelector('.lg-toolbar').insertAdjacentHTML('beforeend', fullScreen);
                        this.fullScreen();
                    }
                }
            };

            Fullscreen.prototype.requestFullscreen = function () {
                let el = document.documentElement;
                if (el.requestFullscreen) {
                    el.requestFullscreen();
                } else if (el.msRequestFullscreen) {
                    el.msRequestFullscreen();
                } else if (el.mozRequestFullScreen) {
                    el.mozRequestFullScreen();
                } else if (el.webkitRequestFullscreen) {
                    el.webkitRequestFullscreen();
                }
            };

            Fullscreen.prototype.exitFullscreen = function () {
                if (!this.core.outer.classList.contains('lg-fullscreen-on')) {
                    return;
                }

                if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }
            };

            // https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
            Fullscreen.prototype.fullScreen = function () {
                let _this = this;

                window.utils.on(document, 'fullscreenchange.lgfullscreen webkitfullscreenchange.lgfullscreen mozfullscreenchange.lgfullscreen MSFullscreenChange.lgfullscreen', function () {
                    if (window.utils.hasClass(_this.core.outer, 'lg-fullscreen-on')) {
                        window.utils.removeClass(_this.core.outer, 'lg-fullscreen-on');
                    } else {
                        window.utils.addClass(_this.core.outer, 'lg-fullscreen-on');
                    }
                });

                window.utils.on(this.core.outer.querySelector('.lg-fullscreen'), 'click.lg', function () {
                    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                        _this.requestFullscreen();
                    } else {
                        _this.exitFullscreen();
                    }
                });
            };

            Fullscreen.prototype.destroy = function () {

                // exit from fullscreen if activated
                this.exitFullscreen();

                window.utils.off(document, '.lgfullscreen');
            };

            window.lgModules.fullscreen = Fullscreen;
        });

    },{}]},{},[1])(1)
});
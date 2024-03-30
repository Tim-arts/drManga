/**!
 * lg-hash.js | 1.0.0 | October 5th 2016
 * http://sachinchoolur.github.io/lg-hash.js
 * Copyright (c) 2016 Sachin N;
 * @license GPLv3
 */(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{let g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.LgHash = f()}})(function(){let define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){let a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);let f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}let l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){let n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}let i=typeof require=="function"&&require;for(let o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
                global.lgHash = mod.exports;
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
                },
                hashDefaults = {
                    hash: true
                },
                History = function History (element) {
                    this.el = element;
                    this.core = window.lgData[this.el.getAttribute('lg-uid')];
                    this.core.s = _extends({}, hashDefaults, this.core.s);
                    if (this.core.s.history) {
                        this.init();
                    }

                    return this;
                };

            History.prototype.init = function () {
                let _this = this,
                    load = false,
                    url;

                // Change hash value on after each slide transition
                window.utils.on(_this.core.el, 'onAfterSlide.lghs', function () {
                    if (load) {
                        let location = document.location.href,
                            count = location.split('/').pop().length;
                        url = location.substring(0, location.length - count) + (_this.core.index + 1);

                        if (history.pushState) {
                            history.pushState('', document.title, url);
                        }
                    } else {
                        load = true;
                    }
                });

                // Listen hash change and change the slide according to slide value
                window.utils.on(window, 'historychange.lghistory', function () {
                    // TODO pushState history and update view
                });
            };

            History.prototype.destroy = function () {

            };

            window.lgModules.history = History;
        });

    },{}]},{},[1])(1)
});
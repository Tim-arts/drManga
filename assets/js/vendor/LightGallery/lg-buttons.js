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
                customButtons = {
                    buttons: true
                },
                Buttons = function Buttons (element) {
                    this.el = element;
                    this.core = window.lgData[this.el.getAttribute('lg-uid')];
                    this.core.s = _extends({}, customButtons, this.core.s);
                    if (this.core.s.buttons) {
                        this.init();
                    }

                    return this;
                };

            Buttons.prototype.init = function () {
                let _this = this;

                if (this.core.s.buttons) {
                    let paymentUrl = _this.el.getAttribute('data-payment-url'),
                        frLangage = window.utils.lang === 'fr';

                    let buttonHome = document.createElement('div');
                    buttonHome.classList.add('lg-home');
                    buttonHome.title = 'Retourner sur l\'accueil';
                    buttonHome.innerHTML = '<a href="/"><svg version="1.1" x="0px" y="0px" viewBox="0 0 512 512" width="24" height="24"><path d="M470.4,227l-67.8-67.8V69.7c0-7.3-5.9-13.2-13.2-13.2h-53c-7.3,0-13.2,5.9-13.2,13.2v10.1L285,41.6c-15.6-15.6-40.7-15.5-56.2-0.1L41.6,227c-15.5,15.5-15.5,40.6,0,56.2c11.3,11.5,27.5,14.4,41.3,9.5v176.1c0,7.3,5.9,13.2,13.2,13.2h319.6c7.3,0,13.2-5.9,13.2-13.2V292.6c13.8,4.9,30,1.9,41.3-9.4c7.5-7.5,11.7-17.5,11.7-28.1C482,244.5,477.9,234.5,470.4,227z M349.6,82.9h26.5v49.8l-26.5-26.5V82.9z M296.6,455.5h-79.5V347.8h79.5V455.5z M402.6,455.5h-79.5v-121c0-7.3-5.9-13.2-13.2-13.2H203.9c-7.3,0-13.2,5.9-13.2,13.2v121h-81.2V271.7l147.4-145.9l145.7,145.7V455.5z M451.7,264.5c-5.2,5.2-13.5,5.2-18.7,0c-5.7-5.7-153-153-166.7-166.7c-5.1-5.1-13.5-5.2-18.7-0.1C239.8,105.6,85.6,258,79.1,264.5c-5.1,5.1-13.6,5.1-18.7,0c-5.1-5.1-5.1-13.6,0-18.7L247.5,60.3c5.2-5.2,13.5-5.2,18.7,0c11.6,11.6,180.1,180.1,185.4,185.4C456.9,250.9,456.9,259.4,451.7,264.5z M256.9,188.9c-29.2,0-53,23.8-53,53s23.8,53,53,53s53-23.8,53-53S286.1,188.9,256.9,188.9z M256.9,268.4c-14.6,0-26.5-11.9-26.5-26.5s11.9-26.5,26.5-26.5c14.6,0,26.5,11.9,26.5,26.5S271.5,268.4,256.9,268.4z"/></svg></a>';

                    let buttonCounter = document.createElement('div');
                    buttonCounter.classList.add('lg-counter-pills', 'lg-icon');
                    buttonCounter.title = 'Nombre de pilules possédées';
                    buttonCounter.innerHTML = '<span id="user-pills">' + this.updateUserPills() + '</span>';

                    let buttonPill = document.createElement('div');
                    buttonPill.classList.add('lg-pill', 'lg-icon');
                    buttonPill.title = 'Acheter des pilules';
                    buttonPill.innerHTML = '<a href="' + paymentUrl + '" class="md-vertical-align-sub" target="_blank"><svg version="1.1" x="0px" y="0px" viewBox="0 0 409 409" width="24" height="24"><path d="M343.8,94.4l-24.9-25c-0.2-0.2-0.5-0.5-0.7-0.6l-3.5-3.5c-12.8-12.8-29.8-19.8-47.8-19.8s-35,7-47.7,19.7l-70.7,70.7l-0.1-0.1L65.2,219c-12.8,12.8-19.7,29.8-19.7,47.8c0,18,7,35,19.7,47.7l29.2,29.2c12.8,12.8,29.7,19.7,47.7,19.7c18.1,0,35-7,47.8-19.7l153.8-153.9c12.8-12.8,19.7-29.7,19.7-47.7S356.5,107.2,343.8,94.4z M231.6,77.8c9.4-9.4,21.9-14.6,35.2-14.6s25.8,5.2,35.2,14.6l6.5,6.5c17.3,19.6,16.5,49.5-2.2,68.3l-70.7,70.7l-74.8-74.8L231.6,77.8z M63.1,266.8c0-13.3,5.2-25.8,14.6-35.2l70.7-70.7l74.8,74.8l-70.6,70.6c-19.4,19.4-51.2,19.4-70.6,0l-4.3-4.3C68.4,292.6,63.1,280.2,63.1,266.8z"/></svg></a>';

                    let buttonBookmark = document.createElement('div');
                    buttonBookmark.classList.add('lg-bookmarks', 'lg-icon');
                    buttonBookmark.title = frLangage ? 'Marque-pages' : 'Bookmarks';
                    buttonBookmark.innerHTML = '<svg class="vertical-align-sub" viewBox="0 0 24 24" width="24" height="24"><path d="M6.3,4.9v15.7c0,0,0.1,0.1,0.1,0l5.6-4.4c0,0,0,0,0.1,0l5.6,4.4h0.1V4.9c0-1.5-1.6-1.5-1.6-1.5H7.9C7.9,3.3,6.3,3.3,6.3,4.9z"/></svg>';
                    buttonBookmark.onclick = function () {
                        let pattern = _this.core.pattern,
                            url = pattern.substring(0, pattern.length - (pattern.split('/').pop().length)) + document.location.href.split('/').pop() + '/bookmark';

                        this.classList.toggle('active');

                        $.ajax({
                            method: "POST",
                            url: url,
                            success: function (response) {
                                $.toast({
                                    text: response.message,
                                    showHideTransition: 'fade',
                                    icon: response.success ? 'success' : 'error',
                                    hideAfter: 2000,
                                    stack: false
                                });
                            }
                        });
                    };

                    this.core.outer.querySelector('.lg-toolbar').append(buttonBookmark);
                    this.core.outer.querySelector('.lg-toolbar').append(buttonPill);
                    this.core.outer.querySelector('.lg-toolbar').append(buttonCounter);
                    this.core.outer.querySelector('.lg-toolbar').append(buttonHome);

                    // Update the pills counter
                    window.utils.on(_this.core.el, 'onButtonCounterUpdate.lgbtn', function (data) {
                        buttonCounter.innerText = data.detail.pills;
                    });
                }

                // Update cost page after each slide move
                window.utils.on(this.core.el, 'onAfterSlide', function () {
                    _this.updateNextButton();
                });
            };

            Buttons.prototype.updateNextButton = function () {
                let nextButton = this.core.outer.querySelector('.lg-next');

                // If the user reached the limit, hide the button
                if (this.core.index + 1 === this.core.s.count) {
                    nextButton.classList.add('smooth-hidden')
                } else {
                    if (nextButton.classList.contains('smooth-hidden')) {
                        nextButton.classList.remove('smooth-hidden');
                    }
                }

                // Update the button value
                let value;

                if (this.core.unlocked > (this.core.index + 1) || this.core.index + 1 === this.core.s.count) {
                    value = 0;
                } else {
                    value = this.core.cost;
                }

                document.getElementById('lg-cost-page').innerText = value;
            };

            Buttons.prototype.updateUserPills = function () {
                if (this.core.unlocked === 0) {
                    return Number(this.core.pills) - Number(this.core.cost);
                } else {
                    return Number(this.core.pills);
                }
            };

            Buttons.prototype.destroy = function () {

            };

            window.lgModules.buttons = Buttons;
        });

    },{}]},{},[1])(1)
});

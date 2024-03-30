import { HTMLObject } from 'vendor/GoldenCompany/Rain/HTMLObject';
// Require plugins
// PerfectScrollbar: https://github.com/utatti/perfect-scrollbar
import PerfectScrollbar from 'perfect-scrollbar'; // Use import instead of require because of https://github.com/utatti/perfect-scrollbar/issues/697
require('perfect-scrollbar/css/perfect-scrollbar.css');
require('css/override/_perfect-scrollbar.less');

// Dragscroll: https://github.com/asvd/dragscroll
require('dragscroll');

// Require module files
require('css/modules/_slider.less');

export class Slider extends HTMLObject {
    constructor(el) {
        super(el);
        this.psSlider = new PerfectScrollbar(this.el, {
            suppressScrollY: true,
            scrollingThreshold: 350
        });
        this.el.classList.add('dragscroll');
    }
}
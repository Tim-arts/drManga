import Viewer from 'viewerjs';

import { AjaxButton } from 'vendor/GoldenCompany/Rain/AjaxButton';

// Import modules
// PerfectScrollbar: https://github.com/utatti/perfect-scrollbar
import PerfectScrollbar from 'perfect-scrollbar'; // Use import instead of require because of https://github.com/utatti/perfect-scrollbar/issues/697
require('perfect-scrollbar/css/perfect-scrollbar.css');
require('css/override/_perfect-scrollbar.less');

// Include base files
require('css/views/manga/show.less');

// Require modules
require('vendor/ratings.js');

$(function () {
    let tomes = document.getElementById('tomes');

    // Init plugins
    new Viewer(document.getElementById('preview-images'), {
        title: 3
    });

    // Check if button exists
    if (document.getElementById('btn-read-later')) {
        new AjaxButton('btn-read-later');
    }

    if (tomes) {
        this.psSlider = new PerfectScrollbar(tomes.querySelector('ul'), {
            suppressScrollX: true
        });
    }
});
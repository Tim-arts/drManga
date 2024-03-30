// Import modules
// PerfectScrollbar: https://github.com/utatti/perfect-scrollbar
import { Slider } from 'src/Slider.js';
import { Filter } from 'src/Filter.js';
import { ArrowsSlider } from 'src/ArrowsSlider.js';

$(function () {
    let content = document.getElementById('content'),
        sliders = Array.from(content.querySelectorAll('.h-scroll')),
        filters = Array.from(content.querySelectorAll('.filter')),
        arrows = Array.from(content.querySelectorAll('.arrows'));

    // Init sliders
    for (let slider of sliders) {
        new Slider(slider);
    }

    // Init filters
    for (let filter of filters) {
        new Filter(filter);
    }

    // Init arrows
    for (let arrow of arrows) {
        new ArrowsSlider(arrow);
    }
});
export class ArrowsSlider {
    /**
     * Construct ArrowsSlider instance
     * @param {Element} el
     * @constructor
     */

    constructor(el) {
        let slider = el.querySelector('.template-content'),
            arrowsSlider = el.querySelector('.arrows-slider'),
            arrows = Array.from(el.querySelectorAll('.arrows-slider .arrow')),
            distance = 650;

        // If there is at least one tile
        if (slider.querySelector('[class^="tile"]')) {
            let tileWidth = slider.querySelector('[class^="tile"]').offsetWidth,
                tileCount = slider.querySelectorAll('[class^="tile"]').length,
                sliderWidth = tileWidth * tileCount;

            // If there are not enough books to display
            if (sliderWidth >= window.innerWidth) {
                arrowsSlider.classList.remove('d-none');
                arrowsSlider.classList.add('d-flex');
            } else {
                return;
            }
        } else {
            return;
        }

        for (let arrow of arrows) {
            arrow.onclick = function () {
                let element = this,
                    currentPosition = slider.scrollLeft,
                    maxScrollLeft = slider.scrollWidth - slider.clientWidth;

                if (element.classList.contains('right')) {
                    // Set a maximum
                    if (currentPosition === maxScrollLeft) {
                        return;
                    }

                    $(slider).animate({
                        scrollLeft: currentPosition + distance
                    }, 300);
                } else {
                    // Set a minimum
                    if (currentPosition === 0) {
                        return;
                    }

                    $(slider).animate({
                        scrollLeft: currentPosition - distance
                    }, 300);
                }
            }
        }
    }
}
export class Filter {
    /**
     * Construct Filters instance
     * @param {Element} el
     * @constructor
     */

    constructor(el) {
        let button = el.querySelector('button'),
            links = Array.from(el.querySelectorAll('.dropdown-menu > a'));

        for (let link of links) {
            link.onclick = function () {
                button.innerText = this.innerText;

                // TODO filter results by selected value
            }
        }
    }
}
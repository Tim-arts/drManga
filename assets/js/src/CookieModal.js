export class CookieModal {
    /**
     * Construct Modal instance
     * @param {String} id
     * @param {String} cookieName
     * @param {Object} options
     * @param {Function} callback
     * @constructor
     */

    constructor(id, cookieName, options, callback) {
        let el = $(document.getElementById(id));

        if (!Cookies || Cookies.get(cookieName)) {
            return;
        }

        el.modal(options).on('hidden.bs.modal', function () {
            callback();

            // Allows stacking multiple modals
            if ((window.utils.backdropCount--) > 1) {
                document.body.classList.add('modal-open');
            }
        });

        // Counter that refers to how many backdrop exist in the DOM
        window.utils.backdropCount = document.getElementsByClassName('modal-backdrop').length;
    }
}
export class InputFile {
    /**
     * Construct InputFile instance
     * @param {Element} el
     * @param {Object} options
     * @constructor
     */

    constructor(el, options) {
        let _this = this;

        _this.el = el;
        _this.$el = $(this.el);
        _this.label = this.el.nextSibling.nodeName === 'LABEL';
        _this.img = options.img;

        if (_this.label) {
            _this.label = _this.el.nextElementSibling;
            _this.labelValue = _this.label.innerHTML;
        }

        // When the user click on the image, trigger click on the input itself
        $(_this.img).on('click', function () {
            _this.$el.trigger('click');
        });

        // When the image has been selected
        _this.$el.on('change', function (e) {
            let files = this.files,
                fileName;

            if (!filesIsAuthorized(files)) {
                $.toast({
                    text: 'Un des fichiers est trop lourd (max 1Mo)',
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 5000,
                    stack: false
                });

                return;
            }

            if (this.files && this.files.length > 1) {
                fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
            } else {
                fileName = e.target.value.split('\\').pop();
            }

            if (this.label)
                if (fileName)
                    label.querySelector('span').innerHTML = fileName;
                else
                    label.innerHTML = this.labelValue;
        });

        function filesIsAuthorized (files) {
            let state = [...files].map(x => x.size > 1024);
            state = state.indexOf(true) > -1;

            return state;
        }
    }

    static init($els, options) {
        let arr = [];

        $els.each(function() {
            arr.push(new InputFile(this, options));
        });

        return arr;
    }
}
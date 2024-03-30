import { HTMLObject } from './HTMLObject';

export class Form extends HTMLObject {
    constructor(id) {
        super(document.getElementById(id));

        let _this = this;

        if (this.el) {
            this.el.addEventListener('submit', function (e) {
                _this.submit(e);
            });
        }
    }

    validate () {
        return true;
    }

    submit(e) {
        e.preventDefault();

        let _this = this,
            formData = new FormData(this.el);

        if (this.validate()) {
            $.post({
                url : this.el.action,
                type : this.el.method,
                data: formData,
                processData: false,
                contentType: false,
                success: function (response, status) {
                    _this.onSubmitSuccess(response, status);
                },
                error : function (response, status, error) {
                    console.log(response);
                    console.log(status);
                    console.log(error);
                },
            });
        }
    }

    onSubmitSuccess(response, status) {
        if (response.errors) {
            response.message = [];
            response.errors.forEach(function(element) {
                response.message.push(element);
            });
        }

        $.toast({
            heading: 'Message',
            text: response.message,
            showHideTransition: 'fade',
            icon: response.success ? 'success' : 'error',
            hideAfter: 5000,
            stack: false
        });
    }
}

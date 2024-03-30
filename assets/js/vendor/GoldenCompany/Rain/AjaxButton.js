import { HTMLObject } from './HTMLObject';

export class AjaxButton extends HTMLObject {
    constructor(id) {
        super(document.getElementById(id));

        let _this = this;

        this.el.addEventListener('click', function (e) {
            _this.click(e);
        });
    }

    click(e) {
        let _this = this;

        $.post({
            url : this.getData('url'),
            type : 'POST',
            success: function (response, status) {
                _this.onClickSuccess(response, status);
            },
            error : function (response, status, error) {
                console.log(response);
                console.log(status);
                console.log(error);
            },
        });
    }

    onClickSuccess(response, status) {
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

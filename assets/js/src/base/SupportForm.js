import { Form } from 'vendor/GoldenCompany/Rain/Form';
import { ValidateForm } from 'script/base/ValidateForm';

export class SupportForm extends Form {
    constructor(id) {
        super(id);

        let element = document.getElementById(id);
        this.ValidateFormSupport = new ValidateForm(element, {
            elements: [
                'contact[email]'
            ],
            heading: {
                fr: 'Erreur lors de l\'envoi',
                en: 'Error while sending'
            },
            type: 'support'
        });
    }

    validate () {
        return this.ValidateFormSupport.validated();
    }

    onSubmitSuccess(response) {
        this.ValidateFormSupport.el.reset();

        if (response.success) {
            $.toast({
                text: response.message,
                showHideTransition: 'fade',
                icon: 'success',
                hideAfter: 5000,
                stack: false
            });
        } else {
            $.toast({
                heading: this.ValidateFormSupport.constants.heading,
                text: response.errors,
                showHideTransition: 'fade',
                icon: 'error',
                hideAfter: 5000,
                stack: false
            });
        }
    }
}

import { Form } from 'vendor/GoldenCompany/Rain/Form';
import { ValidateForm } from 'script/base/ValidateForm';

export class ForgotForm extends Form {
    constructor(id) {
        super(id);

        let element = document.getElementById(id);
        this.ValidateFormForgot = new ValidateForm(element, {
            elements: [
                // 'username',
            ],
            heading: {
                fr: 'Erreur lors de la récupération',
                en: 'Error during the retrieval'
            },
            type: 'forgot'
        });
    }

    validate () {
        return this.ValidateFormForgot.validated();
    }

    onSubmitSuccess(response) {
        if (response.success) {
            $.toast({
                heading: window.utils.lang === 'fr' ? 'Email envoyé !' : 'Email sent!',
                text: response.errors,
                showHideTransition: 'fade',
                icon: 'success',
                hideAfter: 5000,
                stack: false
            });
        } else {
            $.toast({
                heading: this.ValidateFormForgot.constants.heading,
                text: response.errors,
                showHideTransition: 'fade',
                icon: 'error',
                hideAfter: 5000,
                stack: false
            });
        }
    }
}

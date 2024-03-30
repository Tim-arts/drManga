import { Form } from 'vendor/GoldenCompany/Rain/Form';
import { ValidateForm } from 'script/base/ValidateForm';

export class LoginForm extends Form {
    constructor(id) {
        super(id);

        let element = document.getElementById(id);
        this.ValidateFormLogin = new ValidateForm(element, {
            elements: [
                '_username',
                '_password'
            ],
            heading: {
                fr: 'Erreur lors de la connexion',
                en: 'Error during the connection'
            },
            type: 'login'
        });
    }

    validate () {
        return this.ValidateFormLogin.validated();
    }

    onSubmitSuccess(response) {
        if (response.success) {
            location.reload();
        } else {
            $.toast({
                heading: this.ValidateFormLogin.constants.heading,
                text: response.errors,
                showHideTransition: 'fade',
                icon: 'error',
                hideAfter: 5000,
                stack: false
            });
        }
    }
}

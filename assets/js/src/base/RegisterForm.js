import { Form } from 'vendor/GoldenCompany/Rain/Form';
import { ValidateForm } from 'script/base/ValidateForm';

export class RegisterForm extends Form {
    constructor(id) {
        super(id);

        let element = document.getElementById(id);
        this.ValidateFormRegister = new ValidateForm(element, {
            elements: [
                'fos_user_registration_form[username]',
                'fos_user_registration_form[email]',
                'fos_user_registration_form[plainPassword][first]',
                'fos_user_registration_form[plainPassword][second]',
                'fos_user_registration_form[settings][subscribedToNewsletter]',
                'modal-register-accept-conditions'
            ],
            heading: {
                fr: 'Erreur lors de l\'inscription',
                en: 'Error during the registration'
            },
            type: 'register'
        });
    }

    validate () {
        return this.ValidateFormRegister.validated();
    }

    onSubmitSuccess(response, status) {
        if (response.success) {
            yaCounter51457322.reachGoal('LEAD');
            location.reload();
        } else {
            $.toast({
                heading: this.ValidateFormRegister.constants.heading,
                text: response.errors,
                showHideTransition: 'fade',
                icon: 'error',
                hideAfter: 5000,
                stack: false
            });
        }
    }
}

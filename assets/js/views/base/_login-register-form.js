import 'vendor/jquery.selectric';

$(function () {
    let modalFormsLoginRegister = document.getElementById('modal-login-register'),
        registerSelectDay = document.getElementById('register-select-day'),
        registerSelectMonth = document.getElementById('register-select-month'),
        registerSelectYear = document.getElementById('register-select-year'),
        // Buttons
        loginDisplayRegisterForm = document.getElementById('login-display-register-section'),
        loginDisplayForgotForm = document.getElementById('login-display-forgot-section'),
        registerDisplayLoginForm = document.getElementById('register-display-login-section'),
        forgotDisplayLoginForm = document.getElementById('forgot-display-login-section');

    /* Init plugins */
    // Selectric
    $(registerSelectDay).selectric();
    $(registerSelectMonth).selectric();
    $(registerSelectYear).selectric();

    /* Events handlers */
    // When the modal is closed, reset classes
    if (modalFormsLoginRegister) {
        modalFormsLoginRegister.addEventListener('hidden.bs.modal', function () {
            this.querySelector('.modal-body-container').classList.remove('open');
            this.querySelector('.modal-body-container').classList.remove('close');
        });
    }

    // Display login or register form
    if (loginDisplayRegisterForm) {
        $(loginDisplayRegisterForm).add($(loginDisplayForgotForm)).add($(registerDisplayLoginForm)).add($(forgotDisplayLoginForm)).on('click', function () {
            let classes = {
                    open: 'open',
                    close: 'close',
                    fadeInUp: 'fadeInUp'
                },
                formToOpen = this.getAttribute('data-section-open'),
                formToClose = this.getAttribute('data-section-close');

            // Close the previous form
            let closeForm = document.querySelector('section[data-form="' + formToClose + '"]');
            closeForm.classList.remove(classes.open);
            closeForm.classList.remove(classes.fadeInUp);
            closeForm.classList.add(classes.close);

            // Open the new one
            let openForm = document.querySelector('section[data-form="' + formToOpen + '"]');
            openForm.classList.remove(classes.close);
            openForm.classList.add(classes.open);
            openForm.classList.add(classes.fadeInUp);
        });
    }
});

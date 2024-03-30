// Import base files
require('css/views/extends/_header.less');
require('./_login-register-form.js');

// Import plugins and styles
// Documentation here: http://leaverou.github.io/awesomplete
import Awesomplete from 'awesomplete';
require('awesomplete/awesomplete.css');

import { LoginForm } from 'src/base/LoginForm.js';
import { RegisterForm } from 'src/base/RegisterForm.js';
import { ForgotForm } from 'src/base/ForgotForm.js';

$(function () {
    let searchForm = document.getElementById('search-form'),
        inputSearch = document.getElementById('input-search');

    // Init plugins
    new LoginForm('fos_user_login_form');
    new RegisterForm('fos_user_registration_form');
    new ForgotForm('fos_user_forgot_form');
    new Awesomplete(inputSearch, {
        maxItems: 10
    });

    /* Events */
    // Avoid reload when submitting the form
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    // Redirect on the selected game page
    inputSearch.addEventListener('awesomplete-selectcomplete', function (e) {
        let options = Array.from(document.getElementById(this.getAttribute('data-list')).querySelectorAll('option')),
            option = options.filter(option => option.text === e.text.value);

        document.location.href = option[0].getAttribute('data-url');
    });
});

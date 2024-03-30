// Include base files
require('css/views/user/setting.less');

import { Form } from 'vendor/GoldenCompany/Rain/Form';

// Import dependencies
import 'vendor/jquery.selectric';
import 'script/base/ValidateForm';

// Import modules
import { InputFile } from 'src/base/InputFile.js';

$(function () {
    new Form('form-profile');
    new Form('form-change-password');
    
    let selects = {
            day: $('#user-select-day'),
            month: $('#user-select-month'),
            year: $('#user-select-year'),
            gender: $('#user-select-gender')
        };

    /* Init plugins */
    new InputFile(document.getElementById('user-upload-avatar'), {
        img: document.getElementById('avatar')
    });

    // Selectric
    selects.day.selectric();
    selects.month.selectric();
    selects.year.selectric();
    selects.gender.selectric();
});

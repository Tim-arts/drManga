// Import base files
require('css/views/extends/_footer.less');

import { SupportForm } from 'src/base/SupportForm.js';

$(function () {
    let contactSelectReason = $('#contact\\[department\\]');

    new SupportForm('contact');
    contactSelectReason.selectric();
});
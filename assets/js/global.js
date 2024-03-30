import { CookieModal } from 'src/CookieModal.js';

$(function() {
    let loginRegisterElements = (function () {
            let self = {};
            self.login = {};
            self.register = {};
            self.login._class = 'login-form-activator';
            self.register._class = 'register-form-activator';
            self.login.elements = $('.' + self.login._class);
            self.register.elements = $('.' + self.register._class);

            return self;
        })(),
        loginRegisterModal = $('#modal-login-register');

    // Dynamically add trigger on every activator button
    loginRegisterElements.login.elements.add(loginRegisterElements.register.elements).each(function () {
        let _this = $(this);
        _this.attr('data-toggle', 'modal');
        _this.attr('data-target', '#modal-login-register');
        _this.on('click', function () {
            let sections = $('section[data-form]'),
                form = _this.hasClass('login-form-activator') ? 'login' : 'register';

            sections.filter('[data-form="' + form + '"]').addClass('open fadeInUp');
            loginRegisterModal.modal('show').on('hidden.bs.modal', function () {
                // Remove 'open' class on every section
                loginRegisterModal.find('.modal-content > section').removeClass('close open fadeInUp');
            });
        });
    });

    // Load tooltip with options
    $(document.body).tooltip({
        selector: '[data-toggle="tooltip"]',
        container: document.body,
        delay: {
            show: 800
        }
    });

    // Init browser-update modal
    if (!window.utils.isValidBrowser) {
        new CookieModal('browser-update', 'browser-update', {
            show: true
        }, function () {
            Cookies.set('browser-update', true, {expires: 1})
        });
    }

    // Init disclaimer modal
    new CookieModal('modal-disclaimer', 'reading-system', {
        backdrop: 'static',
        keyboard: false,
        show: true
    }, function () {
        Cookies.set('reading-system', true)
    });

    // Open support modal with URL
    if (window.location.href.indexOf('#modal-support') > -1) {
        $('#modal-support').modal('show');
    }

    // Events

    // Fix tooltip doesn't disappear after click
    $('[data-toggle="tooltip"]').on('click', function () {
        $(this).tooltip('hide');
    });

    // Prevent jumping top on empty links
    $('a[href="#"]').on('click', function (e) {
        e.preventDefault();
    });
});

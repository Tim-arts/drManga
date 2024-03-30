export class ValidateForm {
    /**
     * Construct ValidateForm instance
     * @param {Element} el
     * @param {Options} options
     * @constructor
     */

    constructor(el, options) {
        let _this = this;

        this.el = el;
        this.constants = {
            classList: {
                valid: "valid",
                error: "invalid"
            },
            lang: utils.lang,
            heading: options.heading[utils.lang]
        };
        this.options = options;
        this.errors = [];
        this.objects = {};
        this.fields = (function () {
            let obj = {};

            if (!el) {
                return;
            }

            for (let element in options.elements) {
                let value = options.elements[element],
                    el = document.getElementsByName(value)[0];

                if ($(el).is(":checkbox")) {
                    obj[value] = {
                        value: el.checked
                    };
                } else {
                    obj[value] = {
                        value: el.value
                    };
                }

                obj[value].element = el;
                obj[value].type = el.getAttribute('data-type');

                // Store DOM elements
                _this.objects[obj[value].type] = el;
            }

            return obj;
        })();
        this.data = (function () {
            let obj = {};

            for (let field in ValidateForm.fields) {
                obj[field] = ValidateForm.fields[field].value;
            }

            return obj;
        })();
        this.tests = {
            name: {
                errors: {
                    fr: 'Pseudonyme trop court (3 caractères minimum) ou trop long (20 caractères maximum)',
                    en: 'Username too short (min 3 characters) or too long (max 20 characters)'
                },
                reg: /^[a-zA-Z0-9_]{3,20}$/
            },
            email: {
                errors: {
                    fr: 'L\'email doit être valide et non-nul',
                    en: 'Email must be valid and not bad'
                },
                reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            },
            password: {
                errors: {
                    fr: 'Le mot de passe doit contenir au moins une minuscule, un chiffre et ne doit pas être trop court (7 caractères minimum) ni trop long (30 caractères maximum)',
                    en: 'Password must contain at least one small letter, one number and must not be too short (min 7 characters) or too long (max 30 characters)'
                },
                reg: /(?=^.{7,30}$)(?=.*\d)(?=.*[a-z])(?!.*\s)[0-9a-z!@#$%^&*()]*/,
                controls: function (field) {
                    if (_this.options.type !== 'login') {
                        // If confirmation password field hasn't been created yet, stop the execution
                        if (!_this.objects.confirmationPassword) {
                            return;
                        }

                        // Update the password confirmation field once password field has been updated
                        $(field.element).on('blur', function () {
                            $(_this.objects.confirmationPassword).trigger('blur');
                        });
                    }
                }
            },
            confirmationPassword: {
                errors: {
                    fr: 'La confirmation du mot de passe doit contenir au moins une minuscule, un chiffre et ne doit pas être trop court (7 caractères minimum) ni trop long (30 caractères maximum)',
                    en: 'Confirmation password must contain at least one small letter, one number and must not be too short (min 7 characters) or too long (max 30 characters)'
                },
                reg: /(?=^.{7,30}$)(?=.*\d)(?=.*[a-z])(?!.*\s)[0-9a-z!@#$%^&*()]*/,
                controls: function (field) {
                    $(field.element).on('blur', function () {
                        let confirmationPasswordTempField = {
                            element: field.element,
                            type: 'passwordsAreNotEqual'
                        };

                        // If passwords are not equal
                        if (!_this.arePasswordsEqual(field)) {
                            _this.raiseError(confirmationPasswordTempField);
                            _this.applyClasses(confirmationPasswordTempField, true);
                        } else {
                            // If error is stored, remove it
                            _this.removeError(confirmationPasswordTempField);
                        }
                    });
                }
            },
            conditions: {
                errors:{
                    fr: 'Veuillez accepter les conditions d\'utilisation',
                    en: 'Please accept the terms of use'
                }
            },
            birthDateDay: {
                errors: {
                    fr: 'Vous devez choisir un jour',
                    en: 'Please select a day'
                },
                verification: function (field) {
                    return (field.value || 0 !== field.value.length);
                }
            },
            birthDateMonth: {
                errors: {
                    fr: 'Vous devez choisir un mois',
                    en: 'Please select a month'
                },
                verification: function (field) {
                    return (field.value || 0 !== field.value.length);
                }
            },
            birthDateYear: {
                errors: {
                    fr: 'Vous n\'avez pas l\'âge minimum requis',
                    en: 'You aren\'t even old enough'
                },
                verification: function (field) {
                    let currentYear = new Date().getFullYear();

                    return (currentYear - field.value) >= 18;
                }
            },
            passwordsAreNotEqual: {
                errors: {
                    fr: 'Les mots de passe ne sont pas identiques',
                    en: 'Passwords are not identical'
                }
            },
            creditCardCode: {
                errors: {
                    fr: 'Le code de la carte n\'est pas valide',
                    en: 'The credit card code is not valid'
                },
                reg: /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
                controls: function (field) {
                    let breakpoints = ['4', '9', '14'],
                        string = ' ';

                    field.element.on({
                        focus: function () {
                            formatValueWithoutSpaces();
                        },
                        blur: function () {
                            formatValueWithSpaces();
                        },
                        paste: function (e) {
                            e.preventDefault();
                        }
                    });

                    formatValueWithSpaces();

                    function formatValueWithSpaces () {
                        let count = this.value.length;

                        if (count === 16) {
                            let value = this.value;

                            for (let i = 0; i < count; i++) {
                                let index = i;

                                if (breakpoints.includes(String(index))) {
                                    value = insertAt(value, index, string);
                                }
                            }

                            this.value = value;
                        }
                    }

                    function formatValueWithoutSpaces () {
                        this.value = this.value.replace(/\s/g, '');
                    }

                    function insertAt (value, index, string) {
                        return value.substr(0, index) + string + value.substr(index);
                    }
                }
            },
            CVV: {
                errors: {
                    fr: 'Le code de sécurité de la carte n\'est pas valide',
                    en: 'The credit card security code is not valid'
                },
                reg: /^[0-9]{3}$/
            }
        };

        this.init();
    }

    init () {
        this.bindFieldEvents(this.fields);
    }

    applyClasses (field, error, alias) {
        let _this = this,
            element = field.element;

        // Reset classes
        element.classList.remove(_this.constants.classList.valid);
        element.classList.remove(_this.constants.classList.error);

        // Alias matches to the correct visual element
        if (alias) {
            applyError(alias, error);
        } else {
            applyError(element, error);
        }

        function applyError (element, error) {
            if (error) {
                element.classList.add(_this.constants.classList.error);
            } else {
                if (element.classList.contains(_this.constants.classList.error)) {
                    element.classList.remove(_this.constants.classList.error);
                }

                if (!element.classList.contains(_this.constants.classList.valid)) {
                    element.classList.add(_this.constants.classList.valid);
                }
            }
        }
    }

    resetClasses (field) {
        let element = field.element;

        element.classList.remove(this.constants.classList.valid);
        element.classList.remove(this.constants.classList.error);
    }

    getElementById (id) {
        return document.getElementById(id);
    }

    validated () {
        for (let field in this.fields) {
            let currentField = this.fields[field];

            if (currentField.type) {
                this.fieldVerification(currentField);
            }
        }

        if (this.errors.length > 0) {
            $.toast({
                heading: this.options.heading[this.constants.lang],
                text: this.errors,
                showHideTransition: 'fade',
                icon: 'error',
                hideAfter: 5000,
                stack: false
            });

            return false;
        } else {
            return true;
        }
    }

    bindFieldEvents (fields) {
        let _this = this;

        for (let field in fields) {
            let currentField = fields[field],
                currentType = currentField.type,
                currentElement = currentField.element;

            $(currentElement).on({
                focus: function () {
                    _this.resetClasses(currentField);
                },
                blur: function () {
                    _this.fieldVerification(currentField);
                },
                change: function () {
                    _this.triggerChange(currentField);
                }
            });

            // If field is not mandatory
            if (!this.tests[currentType]) {
                continue;
            }

            // If the elements has controls, execute them
            if (this.tests[currentType].controls) {
                this.tests[currentType].controls(currentField);
            }
        }
    }

    triggerChange (field) {
        let newValue = $(field.element).is(':checkbox') ? field.element.checked : field.element.value,
            id = field.element.getAttribute('id');

        this.data[id] = newValue;
        field.value = newValue;

        // Trigger verification only on selects and checkboxes because elements have no trigger yet
        if (field.type === 'birthDateDay'   ||
            field.type === 'birthDateMonth' ||
            field.type === 'birthDateYear'  ||
            field.type === 'conditions') {
            this.fieldVerification(field);
        }
    }

    fieldVerification (field) {
        let id = field.element.getAttribute('id'),
            element;

        switch (field.type) {
            case undefined:
                return;
            case 'birthDateDay':
            case 'birthDateMonth':
            case 'birthDateYear':
                // Adapt to selectric transformations
                element = $(field.element).parent().next()[0];

                // If value is empty
                if (!field.value) {
                    this.raiseError(field);
                    this.applyClasses(field, true, element);

                    return;
                }

                // If age verification is not valid
                if (!this.tests[field.type].verification(field)) {
                    this.raiseError(field);
                    this.applyClasses(field, true, element);
                } else {
                    // If error is stored, remove it
                    this.removeError(field);
                    this.applyClasses(field, false, element);
                }

                break;
            case 'conditions':
                element = $(field.element).next()[0];

                // If is not checked
                if (!this.data[id]) {
                    this.raiseError(field);
                    this.applyClasses(field, true, element);
                } else {
                    this.removeError(field);
                    this.applyClasses(field, false, element);
                }

                break;
            case 'name':
            case 'email':
            case 'password':
            case 'confirmationPassword':
            case 'creditCardCode':
            case 'CVV':
                // If value is empty
                if (!field.value) {
                    this.raiseError(field);
                    this.applyClasses(field);
                }

                // If regexp test is not valid
                if (this.tests[field.type].reg !== undefined && !this.tests[field.type].reg.test(field.value)) {
                    this.raiseError(field);
                    this.applyClasses(field, true);

                    return;
                }

                // If error is stored, remove it
                this.removeError(field);
                this.applyClasses(field);

                break;
            default:
                break;
        }
    }

    isErrorStored (field) {
        return this.errors.indexOf(this.tests[field.type].errors[this.constants.lang]) > -1;
    }

    raiseError (field) {
        // Raise error, if not stored, store it
        if (!this.isErrorStored(field)) {
            this.errors.push(this.tests[field.type].errors[this.constants.lang]);
        }
    }

    removeError (field) {
        let index = this.errors.indexOf(this.tests[field.type].errors[this.constants.lang]);

        // Check if the error is stored before removing it
        if (!this.isErrorStored(field)) {
            return;
        }

        if (index !== -1) {
            this.errors.splice(index, 1);
        }
    }

    arePasswordsEqual (field) {
        let password = this.data[this.objects.password.getAttribute('id')],
            confirmationPassword = field.value;

        return password === confirmationPassword;
    }
}

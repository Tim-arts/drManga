// Include base files
require('css/views/payment.less');

import { PaymentMethod } from 'src/payment/PaymentMethod';


$(function () {
    let paymentMethods = $('#payment-methods'),
        paymentButtons = $('#payment-buttons'),
        paymentMethodsElements = paymentMethods.find('.payment-method'),
        paymentButtonsContainers = paymentButtons.find('.payment-button-container'),
        paymentConditions = $('#payment-conditions');

    // Init every payment method
    paymentMethodsElements.each(function () {
        new PaymentMethod(this, paymentMethodsElements);
    });

    // If conditions aren't checked, block the payment
    paymentConditions.on('click', function () {
        let buttons = paymentButtons.find('.payment-button');
        buttons.toggleClass('disabled');
    });

    // Add some errors on pill's container if conditions aren't checked
    paymentButtonsContainers.on('click', function () {
        if (!paymentConditions[0].checked) {
            $.toast({
                text: 'Veuillez d\'abord accepter les CGV et CGU',
                showHideTransition: 'fade',
                icon: 'error',
                hideAfter: 5000,
                stack: false
            });
        }
    });
});
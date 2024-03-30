import { HTMLObject } from 'vendor/GoldenCompany/Rain/HTMLObject';
import { PaypalButton } from 'src/payment/PaypalButton';

const SELECTED_CLASS = 'selected',
      BUTTONS_CLASS = ['.paypal-button', '.securion-button', '.paysafecard-button'];

export class PaymentMethod extends HTMLObject {
    constructor(el, elements) {
        super(el);
        let _this = this;

        if (this.getData('method') === 'paypal') {
            $.get(this.getData('url'), function(data) {
                _this.setData('client-token', data);

                // Init the paypal buttons
                let paypalButtons = Array.from(document.getElementById('payment-buttons').querySelectorAll('.paypal-btn'));
                for (let paypalButton of paypalButtons) {
                    new PaypalButton(paypalButton);
                }
            });
        }

        _this.el.onclick = function () {
            if (_this.el.classList.contains(SELECTED_CLASS)) {
                return;
            }

            let allPaymentButtons = BUTTONS_CLASS.join(','),
                selectedPaymentButtons = '.' + _this.el.getAttribute('data-method') + '-button';

            // Remove 'selected' class to all elements
            elements.toArray().forEach(function (element) {
                element.classList.remove(SELECTED_CLASS);
            });

            // Assign 'selected' class to the selected element
            _this.el.classList.add(SELECTED_CLASS);

            // Trigger click event from parent to child
            _this.el.querySelector('input[type="radio"]').checked = true;

            // Hide all payment buttons
            document.querySelectorAll(allPaymentButtons).forEach(function (element) {
                element.classList.add('hidden');
            });

            // Display the selected one
            document.querySelectorAll(selectedPaymentButtons).forEach(function (element) {
                element.classList.remove('hidden');
            });
        }
    }
}

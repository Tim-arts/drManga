import { HTMLObject } from 'vendor/GoldenCompany/Rain/HTMLObject';

export class PaypalButton extends HTMLObject {
    constructor(el) {
        super(el);
        let _this = this;

        paypal.Button.render({
            braintree: braintree,
            client: {
                production: $('#paypal').attr('data-client-token'),
                sandbox: $('#paypal').attr('data-client-token')
            },
            locale: 'fr_FR',
            style: {
                color: 'black',
                label: 'buynow',
                shape: 'pill',
                size: 'small'
            },
            env: this.getData('environment'),
            commit: true, // This will add the transaction amount to the PayPal button

            payment: function (data, actions) {
                return actions.braintree.create({
                    flow: 'checkout', // Required
                    amount: _this.getData('order-price'), // Required
                    currency: 'EUR' // Required
                });
            },

            onAuthorize: function (data, actions) {
                $.post(_this.getData('url'), {
                    payment_nonce: data.nonce,
                    orderId: _this.getData('order-id'),
                    paypalOrderId: data.paymentID
                }, function(response) {
                    if(response.success) {
                        $.toast({
                            text: response.message,
                            showHideTransition: 'fade',
                            icon: 'success',
                            hideAfter: 5000,
                            stack: false
                        });

                        window.dataLayer.push({
                            "ecommerce": {
                                "currencyCode": "EUR",
                                "purchase" : {
                                    "actionField": {
                                        "id" : "TRX987"
                                    },
                                    "products": [
                                        {
                                            "id": "P15432",
                                            "name" : "Pilules",
                                            "price": response.price,
                                            "brand": "Yandex",
                                            "category": "Pilules",
                                        }
                                    ]
                                }
                            }
                        });
                    } else {
                        $.toast({
                            text: response.message,
                            showHideTransition: 'fade',
                            icon: 'error',
                            hideAfter: 5000,
                            stack: false
                        });
                    }
                });
            },

            onCancel: function (data) {
                $.toast({
                    text: 'Transaction annulée',
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 5000,
                    stack: false
                });
            },

            onError: function (err) {
                $.toast({
                    text: 'Une erreur est survenue',
                    showHideTransition: 'fade',
                    icon: 'error',
                    hideAfter: 5000,
                    stack: false
                });

                console.log(err);
            }
        }, this.el.id);
    }
}

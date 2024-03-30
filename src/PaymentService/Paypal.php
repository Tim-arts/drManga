<?php
namespace App\PaymentService;

use App\Entity\Commerce\Order;

class Paypal extends AbstractPaymentService
{
    /**
     * @var \Braintree_Gateway
     */
    private $gateway;

    public function __construct(string $privateKey)
    {
        $this->name = 'paypal';
        $this->privateKey = $privateKey;
        $this->gateway = new \Braintree_Gateway(['accessToken' => $privateKey]);
    }

    /**
     * @return string
     */
    public function generateClientToken(): string
    {
        return $this->gateway->clientToken()->generate();
    }

    /**
     * Create a transaction with provided payment nonce
     * @param  Order $order
     * @param  string $paymentMethodNonce
     * @param  int    $orderId
     * @return [type]
     */
    public function createTransaction(Order $order, string $paymentMethodNonce, string $orderId)
    {
        return $this->gateway->transaction()->sale([
            "amount" => $order->getTotalPrice(),
            'merchantAccountId' => $order->getCurrency(),
            "paymentMethodNonce" => $paymentMethodNonce,
            "orderId" => $orderId,
            "options" => [
            "submitForSettlement" => true,
            ],
            "descriptor" => [
                "name" => "bdg sas*drmanga.com",
            ],
        ]);
    }

    public function retrieveTransaction(string $orderId)
    {
        return $this->gateway->transaction()->find($orderId);
    }
}

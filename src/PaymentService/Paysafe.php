<?php
namespace App\PaymentService;

use App\Entity\Commerce\Order;
use App\Entity\UserManagement\User;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class Paysafe extends AbstractPaymentService
{
    /**
     * Callback url
     * @var string
     */
    private $callbackUrl;

    /**
    * @var UrlGeneratorInterface
    */
    private $router;

    public function __construct(string $privateKey, string $callbackUrl, UrlGeneratorInterface $router)
    {
        $this->name = 'paysafe';
        $this->privateKey = base64_encode($privateKey);
        $this->callbackUrl = $callbackUrl;
        $this->router = $router;
    }

    public function handleCallback(Order $order)
    {
        $data = [
            "type" => "PAYSAFECARD",
            "amount" => $order->getTotalPrice(),
            "currency" => $order->getCurrency(),
            "redirect" => [
                "success_url" => $this->router->generate('payment_service_paysafe_success', [], UrlGeneratorInterface::ABSOLUTE_URL)."?paysafe_id={payment_id}&order_id=".$order->getId(),
                "failure_url" => $this->router->generate('payment_service_paysafe_error', [], UrlGeneratorInterface::ABSOLUTE_URL)
            ],
            "notification_url" => $this->router->generate('payment_service_paysafe_notification', [], UrlGeneratorInterface::ABSOLUTE_URL)."?payment_id={payment_id}&order_id=".$order->getId(),
            "customer" => [
                "id" => $order->getUser()->getId()
            ]
        ];

        $dataString = json_encode($data);

        $ch = curl_init($this->callbackUrl ."payments");
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $dataString);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Content-Length: '.strlen($dataString),
                "Authorization: Basic ". $this->privateKey,
            ]
        );

        return json_decode(curl_exec($ch), true);
    }

    public function retrievePayment(string $paymentId): array
    {
        $ch = curl_init($this->callbackUrl ."payments/$paymentId");
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                "Authorization: Basic ". $this->privateKey,
            ]
        );

        return json_decode(curl_exec($ch), true);
    }

    public function capturePayment(string $paymentId): array
    {
        $ch = curl_init($this->callbackUrl ."payments/$paymentId/capture");
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                "Authorization: Basic ". $this->privateKey,
            ]
        );

        return json_decode(curl_exec($ch), true);
    }
}

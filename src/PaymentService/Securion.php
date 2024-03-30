<?php
namespace App\PaymentService;

use App\Entity\Commerce\Order;
use App\Entity\UserManagement\User;
use Doctrine\ORM\EntityManagerInterface;
use SecurionPay\SecurionPayGateway;
use SecurionPay\Request\CheckoutRequestCharge;
use SecurionPay\Request\CheckoutRequest;

class Securion extends AbstractPaymentService
{
    /**
     * @var EntityManagerInterface
     */
   protected $entityManager;

    /**
     * @var SecurionPayGateway
     */
    private $securionPay;

    /**
     * @param EntityManagerInterface $entityManager [description]
     * @param string                 $privateKey    [description]
     */
    public function __construct(EntityManagerInterface $entityManager, string $privateKey)
    {
        $this->name = 'securion';
        $this->privateKey = $privateKey;
        $this->securionPay = new SecurionPayGateway($privateKey);
        $this->entityManager = $entityManager;
    }

    /**
     * Add $securionCustomerId to $user
     * @param User   $user
     * @param string $customerId
     */
    public function addCustomerId(User $user, string $customerId): void
    {
        if (!$user->getSecurionCustomerId()) {
            $user->setSecurionCustomerId($customerId);
            $this->entityManager->persist($user);
            $this->entityManager->flush();
        }
    }

    /**
     * generateSecurionCheckoutRequest
     * @param  Order   $order
     * @return string
     */
    public function generateCheckoutRequest(Order $order): string
    {
        $checkoutCharge = new CheckoutRequestCharge();

        $checkoutCharge->amount(($order->getTotalPrice() * 100))->currency($order->getCurrency());

        $checkoutRequest = new CheckoutRequest();
        $securionCustomerId = null;//$user->getSecurionCustomerId(); FIXME: Why ?
        if ($securionCustomerId) {
             $checkoutRequest->charge($checkoutCharge)->customerId($securionCustomerId);
        } else {
             $checkoutRequest->charge($checkoutCharge);
        }

        return $this->securionPay->signCheckoutRequest($checkoutRequest);
    }

    /**
     * Retrieve a charge
     * @param  string $chargeId
     * @return string
     */
    public function retrieveCharge(string $chargeId)
    {
        return $this->securionPay->retrieveCharge($chargeId);
    }
}

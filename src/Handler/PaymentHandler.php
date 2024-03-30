<?php

namespace App\Handler;

use App\Entity\Commerce\Order;
use App\Mailer\Mailjet;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Translation\TranslatorInterface;

class PaymentHandler
{
    /**
     * @var EntityManagerInterface
     */
    protected $entityManager;

    /**
     * @var Mailjet
     */
    protected $mailer;

    /**
     * @var TranslatorInterface
     */
    protected $translator;

    /**
     * @param EntityManagerInterface $entityManager
     * @param Mailjet                 $mailer
     * @var TranslatorInterface      $translator
     */
    function __construct(EntityManagerInterface $entityManager, Mailjet $mailer, TranslatorInterface $translator)
    {
        $this->entityManager = $entityManager;
        $this->mailer = $mailer;
        $this->translator = $translator;
    }

    public function onPaymentSuccess(Order $order)
    {
        if ($order->getStatus() == Order::$STATUS['INITIALIZED']) {
            //TODO: Tester si Product = PillOffer
            $user = $order->getUser();
            foreach ($order->getOrderDetails() as $orderDetail) {
                $user->addPills($orderDetail->getProduct()->getPillPrice());
                $user->addPillsBought($orderDetail->getProduct()->getPillPrice());
            }

            $order->setStatus(Order::$STATUS['CONFIRMED']);
            $order->setConfirmedAt(new \DateTime());
            $this->entityManager->persist($order);
            $this->entityManager->persist($user);

            $this->entityManager->flush();

            $this->mailer->sendPostPurchaseEmailMessage($user, $order);

            if ($tracking = $user->getTracking('tfy')) {
                $ch = curl_init("https://owvvm.abtrcker.com/trackpixel/track?tid=". $tracking->getValue() ."&amt=".$order->getTotalPrice() ."&txid=". time());
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
                curl_exec($ch);
            }

            return new JsonResponse([
                    'success' => true,
                    'message' => $this->translator->trans('payment.success'),
                    'order' => $order,
                    'price' => $order->getTotalPrice(),
                ]); //'successid' => $result->transaction->id
        } else {
            return new JsonResponse([
                'success' => false,
                'message' => $this->translator->trans('payment.error'),
            ]);
        }
    }
}

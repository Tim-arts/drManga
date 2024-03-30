<?php

namespace App\Controller\PaymentService;

use App\Entity\Commerce\Order;
use App\Handler\PaymentHandler;
use App\PaymentService\Securion;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @Security("is_granted('ROLE_USER')")
 */
class SecurionController extends AbstractController
{
    public function generateCheckoutRequest(Request $request, Securion $securion, Order $order)
    {
        $signedCheckoutRequest = $securion->generateCheckoutRequest($order);

        return new Response($signedCheckoutRequest);
    }

    /**
     * @Route("/payment-service/securion/handleCallBack", name="payment_service_securion_handle_callback")
     */
    public function handleCallBack(Request $request, Securion $securion, PaymentHandler $paymentHandler, TranslatorInterface $translator)
    {
        try {
            $charge = $securion->retrieveCharge($request->request->get('securionpayChargeId'));
            $securion->addCustomerId($this->getUser(), $request->request->get('securionpayCustomerId'));
            $order = $this->getDoctrine()->getRepository(Order::class)->find($request->request->getInt('orderId'));

            if (!$charge->getCaptured()) { //Impossible de retrouver l'achat
                $response = new JsonResponse([
                    'success' => false,
                    'message' => $translator->trans('payment.error.problem', ['%code%' => '404']),
                ]);
            } elseif ($charge->getFraudDetails()->getStatus() == 'fraudulent') {
                $response = new JsonResponse([
                    'success' => false,
                    'message' => $translator->trans('payment.error.card'),
                ]);
            } else { // Si le paiement a réussi
                $order->setPaymentService($securion->getName());

                $response = $paymentHandler->onPaymentSuccess($order);
            }
        } catch (\Exception $e) {
            $response = new JsonResponse([
                'success' => false,
                'message' => $translator->trans('payment.error'),
            ]);
        }
        $this->addFlash('response', serialize($response));

        return $this->redirectToRoute('payment');
    }
}

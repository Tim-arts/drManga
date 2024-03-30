<?php

namespace App\Controller\PaymentService;

use App\Entity\Commerce\Order;
use App\Handler\PaymentHandler;
use App\PaymentService\Paypal;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Translation\TranslatorInterface;

class PaypalController extends AbstractController
{
    /**
     * @Route("payment_service/paypal/handleCallback", name="payment_service_paypal_handle_callback")
     */
   public function handleCallBack(Request $request, Paypal $paypal, PaymentHandler $paymentHandler, TranslatorInterface $translator)
   {
       $order = $this->getDoctrine()->getRepository(Order::class)->find($request->request->getInt('orderId'));

       try {
           $result = $paypal->createTransaction(
               $order,
               $request->request->get('payment_nonce'),
               $request->request->get('paypalOrderId')
           );
       } catch (\Braintree_Exception_Authorization $e) { //error reporting if needed
           return new JsonResponse([
               'success' => false,
               'message' => $translator->trans('payment.error.problem', ['%code%' => '103'])
           ]);
       }

       if ($result->success) {
           $order->setPaymentService($paypal->getName());
           return $paymentHandler->onPaymentSuccess($order);
       } else {
           return new JsonResponse(['success' => false, 'message' => $result->message]);
       }
   }

   /**
    * @Route("payment_service/paypal/client", name="payment_service_paypal_client_token")
    */
   public function clientToken(Paypal $paypal)
   {
       return new Response($paypal->generateClientToken());
   }
}

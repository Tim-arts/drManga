<?php

namespace App\Controller\PaymentService;

use App\Entity\Commerce\Order;
use App\Handler\PaymentHandler;
use App\PaymentService\Paysafe;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Translation\TranslatorInterface;

class PaysafeController extends AbstractController
{
    /**
     * @Route("/payment-service/paysafe/handleCallBack/{order}", name="payment_service_paysafe_handle_callback")
     */
    public function handleCallBack(Paysafe $paysafe, TranslatorInterface $translator, Order $order)
    {
        $result = $paysafe->handleCallback($order);

        if (isset($result["status"]) && $result["status"] == "INITIATED") {
            $url = $result["redirect"]["auth_url"];

            return $this->redirect($url);
        }

        return new JsonResponse([
            'success' => false,
            'message' => $translator->trans('payment.error.paysafe_connection'),
        ]);
    }

    /**
     * @Route("/payment-service/paysafe/success", name="payment_service_paysafe_success")
     */
    public function success(Request $request, Paysafe $paysafe, PaymentHandler $paymentHandler, TranslatorInterface $translator)
    {
        $paymentId = $request->query->get("paysafe_id");
        $order = $this->getDoctrine()->getRepository(Order::class)->find($request->query->getInt('order_id'));
        $result = $paysafe->retrievePayment($paymentId);

        if ($result["status"] == "AUTHORIZED") {
            $result = $paysafe->capturePayment($paymentId);
        }

        if($result["status"] == "SUCCESS") {
            $order->setPaymentService($paysafe->getName());
            $response = $paymentHandler->onPaymentSuccess($order);
		} else {
            $response = new JsonResponse([
                'success' => false,
                'message' => $translator->trans('payment.error.paysafe_transaction'),
            ]);
		}
        $this->addFlash('response', serialize($response));

        return $this->redirectToRoute('payment');
    }

	/**
     * @Route("/payment-service/paysafe/notification", name="payment_service_paysafe_notification")
     */
    public function notification(Request $request, Paysafe $paysafe, PaymentHandler $paymentHandler, TranslatorInterface $translator)
    {
		if (isset($_REQUEST["payment_id"])) {
			$paymentId = $_REQUEST["payment_id"];
            $result = $paysafe->retrievePayment($paymentId);

			if (isset($result["status"]) && $result["status"] == "AUTHORIZED") {
	            $result = $this->paysafe->capturePayment($paymentId);

				if (isset($result["status"]) && $result["status"] == "SUCCESS") {
					$order = $this->getDoctrine()->getRepository(Order::class)->find($request->request->getInt('order_id'));
                    $paymentHandler->onPaymentSuccess($order);

					return new JsonResponse([
                        "success" => true,
                        "message" => "top up successfull."
                    ]);
				}
			} else {
				if(!isset($result["status"]))
					return new JsonResponse(["success" => false, "message" => "Bad Payment id"]);
				else
					return new JsonResponse(["success" => false, "message" => $result["status"]]);
			}
		} else {
			return new JsonResponse(["success" => false, "message" => "Payment id missing"]);
		}

    	//Default response
    	return new JsonResponse(["success" => true]);
    }

    /**
     * @Route("/payment-service/paysafe/error", name="payment_service_paysafe_error")
     */
    public function error(TranslatorInterface $translator)
    {
        $response = new JsonResponse([
            'success' => false,
            'message' => $translator->trans('payment.error.paysafe_transaction_cancel'),
        ]);
        $this->addFlash('response', serialize($response));

        return $this->redirectToRoute('payment');
    }
}

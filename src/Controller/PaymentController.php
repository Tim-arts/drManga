<?php

namespace App\Controller;

use App\Entity\Commerce\Order;
use App\Entity\Commerce\PillOffer;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Security("is_granted('ROLE_USER')")
 */
class PaymentController extends AbstractController
{
    /**
     * @Route("/paiement", name="payment")
     */
    public function index(Request $request)
    {
        $pillOffers = $this->getDoctrine()->getRepository(PillOffer::class)->findAll();

        //TODO: Foutre ça ailleurs ( OrderManager ?)
        $orders = [];
        $em = $this->getDoctrine()->getManager();

        foreach ($pillOffers as $pill) {
            $order = $this->getDoctrine()->getRepository(Order::class)->findOneBy([
                'user' => $this->getUser(),
                'totalPrice' => $pill->getPrice(),
                'status' => Order::$STATUS['INITIALIZED'],
            ]);

            if ($order) {
                $orders[] = $order;
            } else {
                $order = new Order();
                $order->setUser($this->getUser())
                ->setLocale($request->getLocale())
                ->setCurrency('EUR')
                ->setTotalPrice($pill->getPrice())
                ->addProduct($pill, $pill->getPrice());

                $orders[] = $order;
                $em->persist($order);
            }
        }
        $em->flush();

        $flashResponse = $this->get('session')->getFlashBag()->get('response');
        $flashResponse = $flashResponse ? json_decode(unserialize($flashResponse[0])->getContent()) : null;

        if ($flashResponse)
            $this->addFlash('message', $flashResponse->message);

        $orderSuccessPrice = $flashResponse ? $flashResponse->price : 0;

        return $this->render('payment/index.html.twig', [
            'orders' => $orders,
            'orderSuccessPrice'=> $orderSuccessPrice,
        ]);
    }
}

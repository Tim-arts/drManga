<?php

namespace App\Controller\Admin;

use App\Entity\Commerce\Order;
use Sonata\AdminBundle\Controller\CRUDController;

class StatisticController extends CRUDController
{
    public function listAction()
    {
         $totalMoney = $this->getDoctrine()->getRepository(Order::class)->findTotalMoneySince(new \DateTime('today'))[1];

         return $this->render('admin/statistic.html.twig', [
             'totalMoney' => $totalMoney,
         ]);
    }
}

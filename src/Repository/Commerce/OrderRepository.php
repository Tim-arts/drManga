<?php

namespace App\Repository\Commerce;

use App\Entity\Commerce\Order;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Order|null find($id, $lockMode = null, $lockVersion = null)
 * @method Order|null findOneBy(array $criteria, array $orderBy = null)
 * @method Order[]    findAll()
 * @method Order[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OrderRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Order::class);
    }

    public function findTotalMoneySince(\DateTime $date)
    {
        return $this->createQueryBuilder('o')
            ->where('o.status = 1')
            ->andWhere('o.confirmedAt >= :confirmedAt')
            ->andWhere('o.paymentService != :paymentService')
            ->setParameter('confirmedAt', $date)
            ->setParameter('paymentService', 'DrManga')
            ->select('SUM(o.totalPrice)')
            ->getQuery()
            ->getOneOrNullResult();
        ;
    }
}

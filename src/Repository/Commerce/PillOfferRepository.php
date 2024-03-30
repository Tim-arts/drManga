<?php

namespace App\Repository\Commerce;

use App\Entity\Commerce\PillOffer;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method PillOffer|null find($id, $lockMode = null, $lockVersion = null)
 * @method PillOffer|null findOneBy(array $criteria, array $orderBy = null)
 * @method PillOffer[]    findAll()
 * @method PillOffer[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PillOfferRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, PillOffer::class);
    }

//    /**
//     * @return PillOffer[] Returns an array of PillOffer objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?PillOffer
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

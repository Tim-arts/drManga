<?php

namespace App\Repository\Reading;

use App\Entity\Reading\MangaUser;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method MangaUser|null find($id, $lockMode = null, $lockVersion = null)
 * @method MangaUser|null findOneBy(array $criteria, array $orderBy = null)
 * @method MangaUser[]    findAll()
 * @method MangaUser[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MangaUserRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, MangaUser::class);
    }

//    /**
//     * @return MangaUser[] Returns an array of MangaUser objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('m.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?MangaUser
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

<?php

namespace App\Repository\Reading;

use App\Entity\Reading\Category;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * @method Category|null find($id, $lockMode = null, $lockVersion = null)
 * @method Category|null findOneBy(array $criteria, array $orderBy = null)
 * @method Category[]    findAll()
 * @method Category[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CategoryRepository extends ServiceEntityRepository
{
    /**
     * @var RequestStack
     */
    protected $requestStack;

    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Category::class);
    }

    /**
     * @required
     */
    public function setRequestStack(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    public function findAllWithMangaVisible(): array
    {
        return $this->createQueryBuilder('c')
            ->select('c')
            ->innerJoin('c.mangas', 'm')
            ->andWhere('m.visible = 1')
            ->groupBy('c.id')
            ->orderby('COUNT(m.id)', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }
}

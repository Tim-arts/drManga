<?php

namespace App\Repository\Slider;

use App\Entity\Slider\MangaSlide;
use App\Repository\Slider\SlideRepository;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method MangaSlide|null find($id, $lockMode = null, $lockVersion = null)
 * @method MangaSlide|null findOneBy(array $criteria, array $orderBy = null)
 * @method MangaSlide[]    findAll()
 * @method MangaSlide[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MangaSlideRepository extends SlideRepository
{
    public function __construct(RegistryInterface $registry)
    {
        ServiceEntityRepository::__construct($registry, MangaSlide::class);
    }
}

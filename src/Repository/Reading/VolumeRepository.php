<?php

namespace App\Repository\Reading;

use App\Entity\Reading\Manga;
use App\Entity\Reading\Volume;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Volume|null find($id, $lockMode = null, $lockVersion = null)
 * @method Volume|null findOneBy(array $criteria, array $orderBy = null)
 * @method Volume[]    findAll()
 * @method Volume[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VolumeRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Volume::class);
    }

    public function findOneByMangaAndPosition(Manga $manga, int $position)
    {
        return $this->findOneBy([
            'manga' => $manga,
            'position' => $position,
        ]);
    }
}

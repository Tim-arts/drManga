<?php

namespace App\Repository\Reading;

use App\Entity\Reading\Manga;
use App\Entity\Reading\Page;
use App\Entity\Reading\ReadingSupportInterface;
use App\Entity\Reading\Volume;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Page|null find($id, $lockMode = null, $lockVersion = null)
 * @method Page|null findOneBy(array $criteria, array $orderBy = null)
 * @method Page[]    findAll()
 * @method Page[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PageRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Page::class);
    }

    public function findOneByReadingSupportAndName(ReadingSupportInterface $readingSupport, string $pageName)
    {
        if (get_class($readingSupport) == Manga::class) {
            return $this->findOneBy([
                'manga' => $readingSupport,
                'name' => $pageName,
            ]);
        }

        return $this->findOneBy([
            'volume' => $readingSupport,
            'name' => $pageName,
        ]);
    }

    public function findOneByReadingSupportAndPosition(ReadingSupportInterface $readingSupport, int $position)
    {
        if (get_class($readingSupport) == Manga::class) {
            return $this->findOneBy([
                'manga' => $readingSupport,
                'position' => $position,
            ]);
        }

        return $this->findOneBy([
            'volume' => $readingSupport,
            'position' => $position,
        ]);
    }
}

<?php

namespace App\Repository\Reading;

use App\Entity\Reading\Manga;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * @method Manga|null find($id, $lockMode = null, $lockVersion = null)
 * @method Manga|null findOneBy(array $criteria, array $orderBy = null)
 * @method Manga[]    findAll()
 * @method Manga[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MangaRepository extends ServiceEntityRepository
{
    /**
     * @var RequestStack
     */
    protected $requestStack;

    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Manga::class);
    }

    /**
     * @required
     */
    public function setRequestStack(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    public function findAllVisible(): array
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.visible = 1')
            ->orderBy('m.releaseDate', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findAll(): array
    {
        return $this->createQueryBuilder('m')
            ->getQuery()
            /*->setHint(\Doctrine\ORM\Query::HINT_CUSTOM_OUTPUT_WALKER,'Gedmo\\Translatable\\Query\\TreeWalker\\TranslationWalker')
            ->setHint(\Gedmo\Translatable\TranslatableListener::HINT_INNER_JOIN, true)
            ->setHint(\Gedmo\Translatable\TranslatableListener::HINT_TRANSLATABLE_LOCALE, $this->requestStack->getCurrentRequest()->getLocale())*/
            ->getResult()
        ;
    }

    /**
     * find top mangas
     * @param  integer $resultsNumber
     * @return array
     */
    public function findTopMangas(int $resultsNumber = 10): array
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.visible = 1')
            ->orderBy('m.position', 'ASC')
            ->setMaxResults($resultsNumber)
            ->getQuery()
            /*->setHint(\Doctrine\ORM\Query::HINT_CUSTOM_OUTPUT_WALKER,'Gedmo\\Translatable\\Query\\TreeWalker\\TranslationWalker')
            ->setHint(\Gedmo\Translatable\TranslatableListener::HINT_INNER_JOIN, true)
            ->setHint(\Gedmo\Translatable\TranslatableListener::HINT_TRANSLATABLE_LOCALE, $this->requestStack->getCurrentRequest()->getLocale())*/
            ->getResult()
        ;
    }
}

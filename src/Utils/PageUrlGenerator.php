<?php

namespace App\Utils;

use App\Entity\Reading\Manga;
use App\Entity\Reading\ReadingSupportInterface;
use App\Entity\Reading\Volume;
use App\Utils\PageUrlGenerator;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class PageUrlGenerator
{
    /**
     * @var UrlGeneratorInterface
     */
    protected $urlGenerator;

    public function __construct(UrlGeneratorInterface $urlGenerator)
    {
        $this->urlGenerator = $urlGenerator;
    }

    /**
     * @param  Volume $volume
     * @param  Page   $page
     * @param  Manga $manga
     * @return string
     */
    public function generateUrl(ReadingSupportInterface $readingSupport, int $pageNumber): string
    {
        $parameters = [
            'mangaSlug' => $readingSupport->getSlug(),
            'pageNumber' => $pageNumber,
        ];

        $name = 'reading_manga_page';
        if (get_class($readingSupport) == Volume::class) {
            $name = 'reading_volume_page';
            $parameters['volumeId'] = $readingSupport->getId();
        }

        return $this->urlGenerator->generate($name, $parameters, UrlGeneratorInterface::ABSOLUTE_URL);
    }
}

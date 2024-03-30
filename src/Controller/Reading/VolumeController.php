<?php

namespace App\Controller\Reading;

use App\Entity\Reading\Manga;
use App\Entity\Reading\Page;
use App\Entity\Reading\ReadingSupportInterface;
use App\Entity\Reading\Volume;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class VolumeController extends AbstractController
{
    /**
     * @Route("/mangas/{mangaSlug}/volumes/volume-{volumePosition}", name="reading_volume_show")
     * @ParamConverter("manga", options={"mapping"={"mangaSlug"="slug"}})
     */
    public function show(Request $request, Manga $manga, int $volumePosition)
    {
        $volume = $this->getDoctrine()->getRepository(Volume::class)->findOneByMangaAndPosition($manga, $volumePosition);
        if (!$volume) {
            throw $this->createNotFoundException();
        }

        $publicDir = $this->getParameter('kernel.project_dir').'/public';
        $previewDir = '/upload/mangas/'. $volume->getManga()->getDirectory() .'/volumes/'. $volume->getDirectory() .'/previews/'. $request->getLocale() .'/';
        $mangaPreviewDir = '/upload/mangas/'. $volume->getManga()->getDirectory() .'/previews/'. $request->getLocale() .'/';
        $previews = [];

        if (is_dir($publicDir.$previewDir) || is_dir($publicDir.($previewDir = $mangaPreviewDir))) {
            $previews = array_diff(scandir($publicDir.$previewDir), ['.', '..']);
            foreach ($previews as $key => $value) {
                $previews[$key] = [
                    'src' => $previewDir.$value,
                    'alt' => "Image $key",
                ];
            }
        }

        $lastPage = $this->getUser() ? $this->getUser()->getLastPageByReadingSupport($volume): null;

        return $this->render('reading/volume/show.html.twig', [
            'readingSupport' => $volume,
            'previews' => $previews,
            'lastPage' => $lastPage,
        ]);
    }

    /**
     * @Route({
     *     "fr": "/mangas/{mangaSlug}/volumes/volume-{volumePosition}/lecture/{pageNumber}",
     *     "en": "/mangas/{mangaSlug}/volumes/volume-{volumePosition}/reading/{pageNumber}"
     * }, name="reading_volume_read")
     * @Security("is_granted('ROLE_USER')")
     * @ParamConverter("manga", options={"mapping"={"mangaSlug"="slug"}})
     */
    public function read(Manga $manga, int $volumePosition, int $pageNumber)
    {
        $volume = $this->getDoctrine()->getRepository(Volume::class)->findOneByMangaAndPosition($manga, $volumePosition);
        if (!$volume) {
            throw $this->createNotFoundException();
        }

        return $this->forward(ReadingSupportController::class.'::read', [
            'readingSupport' => $volume,
            'pageNumber' => $pageNumber,
        ]);
    }

    /**
     * @Route("/mangas/{mangaSlug}/volumes/{volumeId}/pages/{pageNumber}", name="reading_volume_page")
     * @Security("is_granted('ROLE_USER')")
     * @ParamConverter("volume", options={"mapping"={"volumeId"="id"}})
     */
    public function getPage(Request $request, Volume $volume, int $pageNumber)
    {
        return $this->forward(ReadingSupportController::class.'::getPage', [
            'request' => $request,
            'readingSupport' => $volume,
            'pageNumber' => $pageNumber,
        ]);
    }

    /**
     * @Route("/mangas/{mangaSlug}/volumes/{volumeId}/pages/{pageNumber}/bookmark", name="reading_volume_bookmark_add")
     * @Security("is_granted('ROLE_USER')")
     * @ParamConverter("volume", options={"mapping"={"volumeId"="id"}})
     */
    public function addBookmark(Volume $volume, int $pageNumber)
    {
        return $this->forward(ReadingSupportController::class.'::addBookmark', [
            'readingSupport' => $volume,
            'pageNumber' => $pageNumber,
        ]);
    }
}

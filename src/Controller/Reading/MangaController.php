<?php

namespace App\Controller\Reading;

use App\Entity\Reading\Manga;
use App\Entity\Reading\MangaUser;
use App\Entity\Reading\Page;
use App\Entity\Reading\ReadingSupportInterface;
use App\Utils\PageUrlGenerator;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class MangaController extends AbstractController
{
    /**
     * @Route("/mangas/{slug}", name="reading_manga_show")
     * @ParamConverter("manga", options={"mapping"={"slug"="slug"}})
     */
    public function show(Request $request, Manga $manga)
    {
        $publicDir = $this->getParameter('kernel.project_dir').'/public';
        $previewDir = '/upload/mangas/'. $manga->getDirectory() .'/previews/'. $request->getLocale() .'/';
        $previews = [];

        if (is_dir($publicDir.$previewDir)) {
            $previews = array_diff(scandir($publicDir.$previewDir), ['.', '..']);
            foreach ($previews as $key => $value) {
                $previews[$key] = [
                    'src' => $previewDir.$value,
                    'alt' => "Image $key",
                ];
            }
        }

        // TODO: Mettre volume quand y'a un volume ?
        $lastPage = $this->getUser() ? $this->getUser()->getLastPageByReadingSupport($manga): null;

        return $this->render('reading/manga/show.html.twig', [
            'readingSupport' => $manga,
            'previews' => $previews,
            'lastPage' => $lastPage,
        ]);
    }

    /**
     * @Route({
     *     "fr": "/mangas/{slug}/lecture/{pageNumber}",
     *     "en": "/mangas/{slug}/reading/{pageNumber}"
     * }, name="reading_manga_read")
     * @Security("is_granted('ROLE_USER')")
     * @ParamConverter("manga", options={"mapping"={"slug"="slug"}})
     */
    public function read(Manga $manga, int $pageNumber)
    {
        return $this->forward(ReadingSupportController::class.'::read', [
            'readingSupport' => $manga,
            'pageNumber' => $pageNumber,
        ]);
    }

    /**
     * @Route("/mangas/{id}/read_later", name="reading_manga_read_later")
     * @Security("is_granted('ROLE_USER')")
     */
    public function readLater(Manga $manga)
    {
        $mangaUser = $this->getDoctrine()->getRepository(MangaUser::class)->findOneBy([
            'user' => $this->getUser(),
            'manga' => $manga,
        ]);

        if ($mangaUser) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Déjà en attente',
            ]);
        } else {
            $mangaUser = new MangaUser();
            $mangaUser->setUser($this->getUser());
            $mangaUser->setManga($manga);
            $mangaUser->setStatus(MangaUser::$STATUS['WAITING']);

            $em = $this->getDoctrine()->getManager();
            $em->persist($mangaUser);
            $em->flush();

            return new JsonResponse([
                'success' => true,
                'message' => 'Ajout effectué',
            ]);
        }
    }

    /**
     * @Route("/mangas/{mangaSlug}/pages/{pageNumber}", name="reading_manga_page")
     * @Security("is_granted('ROLE_USER')")
     * @ParamConverter("manga", options={"mapping"={"mangaSlug"="slug"}})
     */
    public function getPage(Request $request, Manga $manga, int $pageNumber)
    {
        return $this->forward(ReadingSupportController::class.'::getPage', [
            'request' => $request,
            'readingSupport' => $manga,
            'pageNumber' => $pageNumber,
        ]);
    }

    /**
     * @Route("/mangas/{mangaSlug}/pages/{pageNumber}/bookmark", name="reading_manga_bookmark_add")
     * @Security("is_granted('ROLE_USER')")
     * @ParamConverter("manga", options={"mapping"={"mangaSlug"="slug"}})
     */
    public function addBookmark(Manga $manga, int $pageNumber)
    {
        return $this->forward(ReadingSupportController::class.'::addBookmark', [
            'readingSupport' => $manga,
            'pageNumber' => $pageNumber,
        ]);
    }

    /**
     * @Route("/mangas/{manga}/note", name="reading_manga_note")
     * @Security("is_granted('ROLE_USER')")
     */
    public function note(Request $request, Manga $manga)
    {
        $mangaUser = $this->getDoctrine()->getRepository(MangaUser::class)->findOneBy([
            'user' => $this->getUser(),
            'manga' => $manga,
        ]);

        // Si l'user a fini le manga
        if ($mangaUser && $mangaUser->getStatus() == MangaUser::$STATUS['FINISHED']) {
            $mangaUser->setVote($request->request->get('value'));

            $em = $this->getDoctrine()->getManager();
            $em->persist($mangaUser);
            $em->flush();

            $note = 0;
            $counter = 0;
            foreach ($manga->getMangaUsers() as $mangaUser) {
                if ($mangaUser->getVote()) {
                    $counter++;
                    $note += $mangaUser->getVote();
                }
            }
            $manga->setNote($note/$counter);

            $em->persist($manga);
            $em->flush();

            return new JsonResponse([
                'success' => true,
                'message' => 'Note enregistrée',
            ]);
        }

        return new JsonResponse([
            'success' => false,
            'message' => 'Le vote n\'est réservé qu\'aux membres ayant fini la lecture du manga',
        ]);
    }

    public function _list()
    {
        $mangas = $this->getDoctrine()->getRepository(Manga::class)->findAll();

        return $this->render('base/_search.html.twig', [
            'mangas' => $mangas,
        ]);
    }
}

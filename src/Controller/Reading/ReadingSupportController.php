<?php

namespace App\Controller\Reading;

use App\Entity\Commerce\Order;
use App\Entity\Reading\Manga;
use App\Entity\Reading\MangaUser;
use App\Entity\Reading\Page;
use App\Entity\Reading\ReadingSupportInterface;
use App\Entity\Reading\Volume;
use App\Utils\PageUrlGenerator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class ReadingSupportController extends AbstractController
{
    public function getPageFile(Request $request, Page $page)
    {
        if ($page->getVolume()) {
            return new BinaryFileResponse($this->getParameter('kernel.project_dir').'/private/upload/mangas/'. $page->getVolume()->getManga()->getDirectory() .'/volumes/'. $page->getVolume()->getDirectory() .'/pages/'. $request->getLocale() .'/'. $page->getName());
        }

        return new BinaryFileResponse($this->getParameter('kernel.project_dir').'/private/upload/mangas/'. $page->getManga()->getDirectory() .'/pages/'. $request->getLocale() .'/'. $page->getName());
    }

    public function getPage(Request $request, ReadingSupportInterface $readingSupport, int $pageNumber)
    {
        $user = $this->getUser();

        if ($pageNumber != 1) {
            $previousPage = $this->getDoctrine()->getRepository(Page::class)->findOneByReadingSupportAndPosition($readingSupport, $pageNumber - 1);

            // Si l'user n'a pas la page précédente ou qu'elle n'existe pas
            if (!$user->hasPage($previousPage)) {
                return new JsonResponse([
                    'success' => false,
                ]);
            }
        }

        $page = $this->getDoctrine()->getRepository(Page::class)->findOneByReadingSupportAndPosition($readingSupport, $pageNumber);
        $manga = $readingSupport->getManga();

        if (!$page) {
            return new JsonResponse(['success' => false]);
        }

        if ($user->hasPage($page)) {
            if ($request->isXmlHttpRequest()) {
                return new JsonResponse([
                    'success' => true,
                    'pills' => $this->getUser()->getPills(),
                ]);
            }

            return $this->getPageFile($request, $page);
        } elseif ($user->getPills() >= $pagePillPrice = $page->getPillPrice() ?? $manga->getPillPrice()) {
            // Buy
            $user->removePills($pagePillPrice);
            $user->addPage($page);

            $mangaUser = $this->getDoctrine()->getRepository(MangaUser::class)->findOneBy([
                'user' => $user,
                'manga' => $manga,
            ]);

            $em = $this->getDoctrine()->getManager();

            // Si l'user avait le manga a lire plus tard, on le change, sinon, on crée un mangaUser
            if ($mangaUser && $mangaUser->getStatus() == MangaUser::$STATUS['WAITING']) {
                $mangaUser->setStatus(MangaUser::$STATUS['STARTED']);
                $em->persist($mangaUser);
            } elseif (!$mangaUser) {
                $mangaUser = new MangaUser();
                $mangaUser->setUser($this->getUser());
                $mangaUser->setManga($manga);
                $mangaUser->setStatus(MangaUser::$STATUS['STARTED']);
                $em->persist($mangaUser);
            }

            // Si la page actuelle est la dernière, le manga est fini
            if ($readingSupport->getPages()->count() === $page->getPosition()) {
                $mangaUser->setStatus(MangaUser::$STATUS['FINISHED']);
            }

            $order = new Order();
            $order->setUser($this->getUser())
                ->setCurrency('PLS')
                ->setTotalPrice($pagePillPrice)
                ->addProduct($page, $pagePillPrice)
                ->setStatus(Order::$STATUS['CONFIRMED'])
                ->setConfirmedAt(new \DateTime())
                ->setPaymentService('DrManga')
                ->setLocale($request->getLocale());

            $em->persist($order);
            $em->persist($user);
            $em->flush();

            if ($request->isXmlHttpRequest()) {
                return new JsonResponse([
                    'success' => true,
                    'pills' => $this->getUser()->getPills(),
                ]);
            }

            return $this->getPageFile($request, $page);
        } else {
            if ($request->isXmlHttpRequest()) {
                return new JsonResponse(['success' => false]);
            }

            return $this->redirect('https://yzgeneration.com/wp-content/uploads/2013/03/Boo-Chien.jpg');
        }
    }

    public function read(ReadingSupportInterface $readingSupport, int $pageNumber, PageUrlGenerator $pageGenerator)
    {
        // TODO: Optimiser car trop de requête
        if ($readingSupport->getPages()->count() == 0) {
            return $this->redirectOnManga($readingSupport);
        }

        $page = $this->getDoctrine()->getRepository(Page::class)->findOneByReadingSupportAndPosition($readingSupport, $pageNumber);

        if (!$page) {
            return $this->redirectOnFirstPage($readingSupport);
        }

        // Si l'user n'a pas la page précédente, on le redirige sur la première
        if ($pageNumber != 1) {
            $previousPage = $this->getDoctrine()->getRepository(Page::class)->findOneByReadingSupportAndPosition($readingSupport, $pageNumber);

            // Si l'user n'a pas la page précédente ou qu'elle n'existe pas
            if (!$this->getUser()->hasPage($previousPage)) {
                return $this->redirectOnFirstPage($readingSupport);
            }
        }

        $paths = [];
        $unlockedPages = $this->getUser()->getPagesByReadingSupport($readingSupport);

        $manga = $readingSupport->getManga();
        $volume = (get_class($readingSupport) == Volume::class) ? $readingSupport : null;

        //TODO: Optimiser tout ça
        //TODO: Rajouter buy quelquepart également ici ?
        if ($pageNumber === 1 && !$this->getUser()->hasPage($page) && $this->getUser()->getPills() < $manga->getPillPrice()) {

        } else {
            // Pour ne renvoyer que les 5 dernières pages
            for ($i = $pageNumber - 4 > 0 ? $pageNumber - 4 : 1; $i <= $pageNumber; $i++) {
                $paths[] = $pageGenerator->generateUrl($readingSupport, $i);
            }
        }

        return $this->render('reading/manga/read.html.twig', [
            'readingSupport' => $readingSupport,
            'volume'=> $volume,
            'paths' => $paths,
            'unlockedPages' => $unlockedPages,
        ]);
    }

    public function addBookmark(ReadingSupportInterface $readingSupport, int $pageNumber)
    {
        $mangaUser = $this->getDoctrine()->getRepository(MangaUser::class)->findOneBy([
            'user' => $this->getUser(),
            'manga' => $readingSupport->getManga(),
        ]);

        $page = $this->getDoctrine()->getRepository(Page::class)->findOneByReadingSupportAndPosition($readingSupport, $pageNumber);

        // Si l'user a le manga commencé ou fini
        if ($mangaUser && $page && $mangaUser->getStatus() == MangaUser::$STATUS['STARTED'] || $mangaUser->getStatus() == MangaUser::$STATUS['FINISHED']) {
            $mangaUser->setBookmark($page);

            $em = $this->getDoctrine()->getManager();
            $em->persist($mangaUser);
            $em->flush();

            return new JsonResponse([
                'success' => true,
                'message' => 'Changement sauvegardé !',
            ]);
        }

        return new JsonResponse([
            'success' => false,
            'message' => 'Une erreur est survenue',
        ]);
    }

    public function redirectOnFirstPage(ReadingSupportInterface $readingSupport)
    {
        if (get_class($readingSupport) == Manga::class) {
            return $this->redirectToRoute('reading_manga_read', [
                'slug' => $readingSupport->getSlug(),
                'pageNumber' => 1,
            ]);
        }

        return $this->redirectToRoute('reading_volume_read', [
            'mangaSlug' => $readingSupport->getManga()->getSlug(),
            'volumePosition' => $readingSupport->getPosition(),
            'pageNumber' => 1,
        ]);
    }

    public function redirectOnManga(ReadingSupportInterface $readingSupport)
    {
        return $this->redirectToRoute('reading_manga_show', [
            'slug' => $readingSupport->getManga()->getSlug(),
        ]);
    }
}

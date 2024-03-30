<?php

namespace App\Controller;

use App\Entity\Reading\Category;
use App\Entity\Reading\Manga;
use App\Entity\Slider\MangaSlide;
use App\Form\ContactType;
use App\Mailer\Mailer;
use App\Utils\DeviceDetector;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * @Route(name="index")
     */
    public function index()
    {
        $mangaSlides = $this->getDoctrine()->getRepository(MangaSlide::class)->findByASCPosition();
        $topMangas = $this->getDoctrine()->getRepository(Manga::class)->findTopMangas();
        $mangas = $this->getDoctrine()->getRepository(Manga::class)->findAllVisible();
        $categories = $this->getDoctrine()->getRepository(Category::class)->findAllWithMangaVisible();

        return $this->render('./index.html.twig', [
            'mangaSlides' => $mangaSlides,
            'topMangas' => $topMangas,
            'mangas' => $mangas,
            'categories' => $categories,
        ]);
    }

    /**
     * @Route("/contact", name="contact", methods={"POST"})
     * @Security("is_granted('ROLE_USER')")
     */
    public function contact(Request $request, Mailer $mailer)
    {
        $form = $this->createForm(ContactType::class);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $formData = $form->getData();
            $formData['username'] = $this->getUser();

            $mailer->sendContactMessage($formData);

            return new JsonResponse([
                'success' => true,
                'message' => 'Message envoyé',
            ]);
        }

        if ($request->isXmlHttpRequest()) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Erreur'
            ]);
        }

        return $this->render('base/modals/_support.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}

<?php

namespace App\Controller\UserManagement;

use App\Entity\Reading\MangaUser;
use App\Entity\UserManagement\User;
use App\Form\ChangePasswordType;
use App\Form\ProfileType;
use FOS\UserBundle\Model\UserManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    /**
     * @Route("/utilisateurs/{usernameCanonical}", name="user_management_user_profile")
     * @ParamConverter("manga", options={"mapping"={"usernameCanonical"="usernameCanonical"}})
     */
    public function profile(User $user)
    {
        $startedMangas = [];
        $finishedMangas = [];
        $waitingMangas = [];

        foreach ($user->getMangaUsers() as $mangaUser) {
            if ($mangaUser->getStatus() == MangaUser::$STATUS['STARTED']) {
                $startedMangas[] = $mangaUser->getManga();
            } elseif ($mangaUser->getStatus() == MangaUser::$STATUS['FINISHED']) {
                $finishedMangas[] = $mangaUser->getManga();
            } elseif ($mangaUser->getStatus() == MangaUser::$STATUS['WAITING']) {
                $waitingMangas[] = $mangaUser->getManga();
            }
        }

        return $this->render('./user/profile.html.twig', [
            'user' => $user,
            'startedMangas' => $startedMangas,
            'finishedMangas' => $finishedMangas,
            'waitingMangas' => $waitingMangas,
        ]);
    }

    /**
     * @Route("/reglages", name="user_management_user_setting")
     * @Security("is_granted('ROLE_USER')")
     */
    public function setting(Request $request)
    {
        $profileForm = $this->createForm(ProfileType::class, $this->getUser(), [
            'validation_groups' => ['Default', 'Profile']
        ]);

        $changePasswordForm = $this->createForm(ChangePasswordType::class, $this->getUser(), [
            'validation_groups' => ['ChangePassword']
        ]);

        return $this->render('./user/setting.html.twig', [
            'profileForm' => $profileForm->createView(),
            'changePasswordForm' => $changePasswordForm->createView(),
        ]);
    }

    /**
     * @Route("/user_management/profile/edit", name="user_management_user_profile_edit", methods="POST")
     * @Security("is_granted('ROLE_USER')")
     */
    public function editProfile(Request $request)
    {
        $form = $this->createForm(ProfileType::class, $this->getUser(), [
            'validation_groups' => ['Default', 'Profile']
        ]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user = $form->getData();

            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();

            return new JsonResponse(['success' => true, 'message' => 'Profil édité']);
        }

        $validationErrors = $form->getErrors();

        // There is some errors, prepare a failure response
        $errors = [];
        if ($form->count()) {
            foreach ($form as $child) {
                if (count($child->getErrors()) != 0) {
                    $errors[] = $child->getErrors()[0]->getMessage();
                }
            }
        }

        return new JsonResponse(['success' => false, 'errors' => $errors]);
    }

    /**
     * @Route("/user_management/profile/change_password", name="user_management_user_change_password", methods="POST")
     * @Security("is_granted('ROLE_USER')")
     */
    public function changePassword(Request $request, UserManagerInterface $userManager)
    {
        $form = $this->createForm(ChangePasswordType::class, $this->getUser(), [
            'validation_groups' => ['Default', 'ChangePassword']
        ]);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user = $form->getData();
            $userManager->updateUser($user);

            return new JsonResponse(['success' => true, 'message' => 'Mot de passe changé']);
        }

        // Sinon erreur
        $validationErrors = $form->getErrors();

        // There is some errors, prepare a failure response
        $errors = [];
        if ($form->count()) {
            foreach ($form as $child) {
                if (count($child->getErrors()) != 0) {
                    $errors[] = $child->getErrors()[0]->getMessage();
                }

                if ($child->getName() === 'plainPassword' && count($child->get('first')->getErrors()) != 0) {
                    $errors[] = $child->get('first')->getErrors()[0]->getMessage();
                }
            }
        }

        return new JsonResponse(['success' => false, 'errors' => $errors]);
    }

    /**
     * @Route("api/users/pills", name="api_users_pills", methods="GET")
     * @Security("is_granted('ROLE_USER')")
     */
    public function getErogold()
    {
        return new JsonResponse([
            'success' => true,
            'pills' => $this->getUser()->getPills(),
        ]);
    }
}

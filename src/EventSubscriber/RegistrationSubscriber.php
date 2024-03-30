<?php

namespace App\EventSubscriber;

use App\Entity\UserManagement\User\Tracking;
use App\Mailer\Mailjet;
use Doctrine\ORM\EntityManagerInterface;
use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Event\FilterUserResponseEvent;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class RegistrationSubscriber implements EventSubscriberInterface
{
    /**
     * @var Mailjet
     */
    protected $mailer;

    /**
     * @var EntityManagerInterface
     */
    protected $em;

    function __construct(Mailjet $mailer, EntityManagerInterface $entityManager)
    {
        $this->mailer = $mailer;
        $this->em = $entityManager;
    }

    /**
    * {@inheritdoc}
    */
    public static function getSubscribedEvents()
    {
        return [
            FOSUserEvents::REGISTRATION_FAILURE => ['onRegistrationFailure', -10],
            FOSUserEvents::REGISTRATION_SUCCESS => ['onRegistrationSuccess', -10],
            FOSUserEvents::REGISTRATION_COMPLETED => 'onRegistrationComplete',
            FOSUserEvents::REGISTRATION_CONFIRM => 'onRegistrationConfirm',
        ];
    }

    public function onRegistrationFailure(FormEvent $event): void
    {
        $form = $event->getForm();
        $validationErrors = $form->getErrors();

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

        $response = new JsonResponse(['success' => false, 'errors' => $errors]);
        $event->setResponse($response);
    }

    public function onRegistrationSuccess(FormEvent $event): void
    {
        $event->setResponse(new JsonResponse(['success' => true]));
    }

    public function onRegistrationComplete(FilterUserResponseEvent $event)
    {
        $request = $event->getRequest();
        $response = $event->getResponse();
        $user = $event->getUser();

        $user->setEnabled(true);

        $trackingCookies = ['tc1', 'tc2', 'tfy'];
        foreach ($trackingCookies as $cookieName) {
            $cookieValue = $request->cookies->get($cookieName);
            $response->headers->clearCookie($cookieName);

            if ($cookieValue) {
                $user->addTracking(new Tracking($cookieName, $cookieValue));
                if ($cookieName == 'tfy') {
                    $ch = curl_init("https://owvvm.abtrcker.com/trackpixel/track?tid=". $cookieValue ."&amt=0");
                    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
                    curl_exec($ch);
                }
            }
        }

        $this->em->persist($user);
        $this->em->flush();
    }

    public function onRegistrationConfirm(GetResponseUserEvent $event)
    {
        $user = $event->getUser();
        $this->mailer->sendConfirmedEmailMessage($user);

        $user->addPills(50);
        $user->getSettings()->setEmailChecked(true);
        $this->em->persist($user);
        $this->em->flush();
    }
}

<?php

namespace App\EventSubscriber;

use Doctrine\ORM\EntityManagerInterface;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\FOSUserEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\RouterInterface;

class ResettingEmailSubscriber implements EventSubscriberInterface
{
    /**
     * @var RouterInterface
     */
    private $router;

    /**
     * @param RouterInterface $router [description]
     */
    function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    /**
    * {@inheritdoc}
    */
    public static function getSubscribedEvents()
    {
        return [
            FOSUserEvents::RESETTING_RESET_SUCCESS => 'onResettingEmailSuccess',
            FOSUserEvents::RESETTING_SEND_EMAIL_COMPLETED => ['onResettingEmailCompleted', -10],
        ];
    }

    public function onResettingEmailSuccess(FormEvent $event)
    {
        $event->setResponse(new RedirectResponse($this->router->generate('index')));
    }

    public function onResettingEmailCompleted(GetResponseUserEvent $event)
    {
        $event->setResponse(new JsonResponse(['success' => true]));
    }
}

?>

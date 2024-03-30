<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;
use Symfony\Component\Routing\RouterInterface;

class KernelSubscriber implements EventSubscriberInterface
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
    public static function getSubscribedEvents(): array
    {
        return [
           KernelEvents::RESPONSE => 'onKernelResponse',
        ];
    }

    /**
     * @param FilterResponseEvent $event
     */
    public function onKernelResponse(FilterResponseEvent $event): void
    {
        $request = $event->getRequest();
        $response = $event->getResponse();

        $this->setCookie($request, $response, 'tc1', 'tc1');
        $this->setCookie($request, $response, 'tc2', 'tc2');
        $this->setCookie($request, $response, 'tfy', 'tid');

        // $lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? 'fr', 0, 2);
        $parameters['_locale'] = 'fr'; //TODO: Remplacer par $lang

        if ($request->getPathInfo() === '/') {
            $url = $this->router->generate('index', $parameters);
            $event->setResponse(new RedirectResponse($url));
        }
    }

    private function setCookie(Request &$request, Response &$response, string $cookieName, string $valueName)
    {
        $cookie = $request->cookies->get($cookieName);

        if (!$cookie) {
            $value = $request->get($valueName);
            if ($value) {
                $response->headers->setCookie(new Cookie($cookieName, $value, strtotime('now + 1 weeks')));
            }
        }
    }
}

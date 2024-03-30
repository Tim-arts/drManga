<?php

namespace App\Mailer;

use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;

class Mailer
{
    /**
     * @var \Swift_Mailer
     */
    private $mailer;

    /**
     * @var EngineInterface $templating
     */
    private $templating;

    public function __construct(\Swift_Mailer $mailer, EngineInterface $templating)
    {
        $this->mailer = $mailer;
        $this->templating = $templating;
    }

    public function sendContactMessage(array $formData)
    {
        $message = (new \Swift_Message())
            ->setSubject("[".$formData['department']."] ".$formData['subject'])
            ->setTo('contact@drmanga.com')
            ->setFrom('no-reply@drmanga.com', 'DrManga')
            ->setBody($this->templating->render('emails/contact.html.twig', [
                'username' => $formData['username'],
                'email' => $formData['email'],
                'message' => $formData['message'],
            ]),
            'text/html'
        );

        $this->mailer->send($message);
    }
}

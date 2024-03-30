<?php

namespace App\Mailer;

use App\Entity\Commerce\Order;
use FOS\UserBundle\Mailer\MailerInterface;
use FOS\UserBundle\Model\UserInterface;
use \Mailjet\Client;
use \Mailjet\Resources;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Translation\TranslatorInterface;

class Mailjet implements MailerInterface
{
    /**
    * @var UrlGeneratorInterface
    */
    protected $router;

    /**
     * @var TranslatorInterface
     */
    private $translator;

    /**
     * @var RequestStack
     */
    protected $requestStack;

   /**
    * @var Client
    */
   private $client;

   /**
    * @var Client
    */
   private $clientList;

   public function __construct(UrlGeneratorInterface $router, TranslatorInterface $translator, RequestStack $requestStack, string $publicKey, string $privateKey)
   {
       $this->router = $router;
       $this->translator = $translator;
       $this->requestStack = $requestStack;
       $this->client = new Client($publicKey, $privateKey, true, ['version' => 'v3.1']);
       $this->clientList = new Client($publicKey, $privateKey);

       $this->client->setConnectionTimeout(10);
       $this->clientList->setConnectionTimeout(10);
   }

    /**
     * {@inheritdoc}
     */
     public function sendConfirmationEmailMessage(UserInterface $user)
     {
         $variables = [
             'username' => $user->getUsername(),
             'email' => $user->getEmail(),
             'urlValidation' => $this->router->generate('fos_user_registration_confirm', [
                 'token' => $user->getConfirmationToken()
             ], UrlGeneratorInterface::ABSOLUTE_URL)
         ];

         $templateId = 625152; //(int) $this->translator->trans('mailjet.confirmation_id');

         $date = new \Datetime();

         $properties = [
             'inscrits' => "True",
             'name' => $user->getUsername(),
             'pseudo' => $user->getUsername(),
             'dateinscription' => $date->format('Y-m-d H:i:s'),
             'langue' => $this->requestStack->getCurrentRequest()->getLocale(),
         ];

         $listId = 25803;

         $this->sendMail($user, $variables, $templateId);
         $this->addUserToList($user, $properties, $listId);
     }

    public function sendConfirmedEmailMessage(UserInterface $user)
    {
        $variables = [
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'urlSettings' => $this->router->generate('user_management_user_setting', [], UrlGeneratorInterface::ABSOLUTE_URL),
        ];

        $templateId = 625289; //(int) $this->translator->trans('mailjet.confirmation_id');

        $this->sendMail($user, $variables, $templateId);
    }

    /**
     * {@inheritdoc}
     */
    public function sendResettingEmailMessage(UserInterface $user)
    {
        $variables = [
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'urlReset' => $this->router->generate('fos_user_resetting_reset', [
                'token' => $user->getConfirmationToken()
            ], UrlGeneratorInterface::ABSOLUTE_URL)
        ];

        $templateId = 625402; //(int) $this->translator->trans('mailjet.confirmation_id');
        $this->sendMail($user, $variables, $templateId);
    }

    public function sendPostPurchaseEmailMessage(UserInterface $user, Order $order)
    {
        $variables = [
            'username' => $user->getUsername(),
            'basePrice' => $order->getTotalPrice(),
            'orderId' => $user->getId() . $order->getId() . time(),
            'pilule' => $order->getOrderDetails()->first()->getProduct()->getPillPrice(),
        ];

        $templateId = 625422; //(int) $this->translator->trans('mailjet.confirmation_id');

        $this->sendMail($user, $variables, $templateId);
    }

    public function sendMail(UserInterface $user, array $variables, int $templateId)
    {
        $body = [
            'Messages' => [
                [
                    'From' => [
                        'Email' => "no-reply@drmanga.com",
                        'Name' => "DrManga"
                    ],
                    'To' => [
                        [
                            'Email' => $user->getEmail(),
                            'Name' => $user->getUsername()
                        ]
                    ],
                    'Variables' => $variables,
                    'TemplateID' => $templateId,
                    'TemplateLanguage' => true,
                ]
            ]
        ];

        return $this->client->post(Resources::$Email, ['body' => $body]);
    }

    public function addUserToList(UserInterface $user, array $properties, int $listId)
    {
        $body = [
            'ContactsLists' => [
                [
                    'ListID' => $listId,
                    'action' => "addforce"
                ]
            ],
            'Contacts' => [
                [
                    'Email' => $user->getEmail(),
                    'Name' => $user->getUsername(),
                    'Properties' => $properties
                ]
            ]
        ];

        return $this->clientList->post(Resources::$ContactManagemanycontacts, ['body' => $body]);
    }
}

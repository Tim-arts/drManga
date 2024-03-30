<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

class ApplicationAvailabilityTest extends WebTestCase
{
    private $client = null;

    /**
     * @dataProvider urlProvider
     */
    public function testPageIsSuccessfulForAnonymous($url)
    {
        $this->client = self::createClient();
        $this->client->followRedirects();
        $this->client->request('GET', $url);

        $this->assertTrue($this->client->getResponse()->isSuccessful());
    }

    /**
     * @dataProvider urlProvider
     */
    public function testPageIsSuccessfulForUser($url)
    {
        $this->login('user');
        $this->client->request('GET', $url);

        $this->assertTrue($this->client->getResponse()->isSuccessful());
    }

    /**
     * @dataProvider urlProvider
     */
    public function testPageIsSuccessfulForAdmin($url)
    {
        $this->login('admin');
        $this->client->request('GET', $url);

        $this->assertTrue($this->client->getResponse()->isSuccessful());
    }

    public function urlProvider()
    {
        return [
            ['/'],
            ['/fr/'],
            ['/fr/paiement'],
            ['/fr/mangas/manga-1'],
            ['/fr/mangas/manga-1/volumes/volume-1'],
            ['/fr/mangas/manga-1/volumes/volume-1/lecture/1'],
            ['/fr/mangas/manga-2'],
            ['/fr/mangas/manga-2/lecture/1'],
            ['/fr/mangas/manga-3/lecture/1'],
            ['/fr/utilisateurs/user'],
            ['/fr/reglages'],
            ['/fr/admin'],
            ['/fr/admin/dashboard']
        ];
    }

    private function login(string $username)
    {
        $this->client = self::createClient();
        $this->client->followRedirects();
        $session = $this->client->getContainer()->get('session');
        $user = $this->client->getContainer()->get('doctrine')->getRepository('App:UserManagement\User')->findOneByUsername($username);

        $firewallName = 'main';
        $firewallContext = 'main';

        $token = new UsernamePasswordToken($user, null, $firewallName, $user->getRoles());
        $session->set('_security_'.$firewallContext, serialize($token));
        $session->save();

        $cookie = new Cookie($session->getName(), $session->getId());
        $this->client->getCookieJar()->set($cookie);
    }
}

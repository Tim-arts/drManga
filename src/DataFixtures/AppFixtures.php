<?php

namespace App\DataFixtures;

use App\Entity\Commerce\PillOffer;
use App\Entity\Reading\Author;
use App\Entity\Reading\Category;
use App\Entity\Reading\Manga;
use App\Entity\Reading\Page;
use App\Entity\Reading\Publisher;
use App\Entity\Reading\Volume;
use App\Entity\Slider\MangaSlide;
use App\Entity\UserManagement\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    /**
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager): void
    {
        // User Management
        $user = new User();
        $user->setUsername('user');
        $password = $this->encoder->encodePassword($user, 'user123#');
        $user->setPassword($password);
        $user->setEmail('user@user.com');
        $user->setEnabled(true);

        $manager->persist($user);

        $publisherAccount = new User();
        $publisherAccount->setUsername('publisher');
        $password = $this->encoder->encodePassword($publisherAccount, 'publisher123#');
        $publisherAccount->setPassword($password);
        $publisherAccount->setEmail('publisher@publisher.com');
        $publisherAccount->setEnabled(true);
        $publisherAccount->setPills(100);
        $publisherAccount->addRole('ROLE_PUBLISHER');

        $manager->persist($publisherAccount);

        $admin = new User();
        $admin->setUsername('admin');
        $password = $this->encoder->encodePassword($admin, 'admin123#');
        $admin->setPassword($password);
        $admin->setEmail('admin@admin.com');
        $admin->setEnabled(true);
        $admin->setPills(100);
        $admin->addRole('ROLE_ADMIN');

        $manager->persist($admin);

        $red = new User();
        $red->setUsername('red');
        $password = $this->encoder->encodePassword($red, 'red123#');
        $red->setPassword($password);
        $red->setEmail('nukacolaquartz@gmail.com');
        $red->setEnabled(true);
        $red->setPills(100);
        $red->addRole('ROLE_SUPER_ADMIN');

        $manager->persist($red);

        // Reading
        $categories = [];
        for ($i=0; $i < 10; $i++) {
            $category = new Category();
            $category->setName('Catégorie-'. ($i+1));
            $category->setImageName('categorie-'. ($i%2+1) .'.jpg');
            $categories[] = $category;

            $manager->persist($category);
        }

        $author = new Author();
        $author->setName('Jack Ryan');

        $manager->persist($author);

        $publisher = new Publisher();
        $publisher->setName('Je sais pas');
        $publisher->setAccount($publisherAccount);

        $manager->persist($publisher);

        $mangas = [];
        for ($i=0; $i < 10; $i++) {
            $manga = new Manga();
            $manga->setName('Manga '. ($i+1));
            $manga->setSubTitle('Sous titre');
            $manga->setDescription('description');
            $manga->setImageName('image.jpg');
            $manga->setAuthor($author);
            $manga->setPublisher($publisher);
            $manga->setReleaseDate(new \DateTime('now'));
            $manga->setPillPrice(1);
            $manga->setPosition($i+1);
            $mangas[] = $manga;

            $manager->persist($manga);
        }

        for ($i=0; $i < 5; $i++) {
            $mangaSlide = new MangaSlide();
            $mangaSlide->setPosition($i+1);
            $mangaSlide->setImageName('slide-'. ($i+1) .'.jpg');
            $mangaSlide->setUrl('mangas/manga-1');

            $manager->persist($mangaSlide);
        }

        // Commerce
        $manager->persist(new PillOffer('350 pilules', 5, 350, 'blue'));
        $manager->persist(new PillOffer('700 pilules', 10, 700, 'purple'));
        $manager->persist(new PillOffer('1750 pilules', 20, 1750, 'purple'));
        $manager->persist(new PillOffer('4500 pilules', 50, 4500, 'purple'));
        $manager->persist(new PillOffer('10000 pilules', 100, 10000, 'yellow'));

        $manager->flush();

        // Erreur avec le slug si flush en même temps que le manga
        $volumes = [];
        for ($i=0; $i < 20; $i++) {
            $volume = new Volume();
            $volume->setName('Volume '.($i+1));
            $volume->setSubTitle('Une aventure extraordinaire');
            $volume->setDescription("Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?");
            $volume->setImageName('image.jpg');
            $volume->setPosition($i+1);
            $volume->setManga($mangas[0]);
            $volumes[] = $volume;

            $manager->persist($volume);
        }

        for ($i=1; $i <= 10; $i++) {
            $page = new Page();
            $page->setVolume($volumes[0]);
            $page->setName($i.'.png');
            $page->setDescription('');
            $page->setPosition($i);

            $manager->persist($page);
        }

        for ($i=1; $i <= 10; $i++) {
            $page = new Page();
            $page->setManga($mangas[1]);
            $page->setName($i.'.png');
            $page->setDescription('');
            $page->setPosition($i);

            $manager->persist($page);
        }

        for ($i=1; $i <= 100; $i++) {
            $page = new Page();
            $page->setManga($mangas[3]);
            $page->setName($i.'.jpg');
            $page->setDescription('');
            $page->setPosition($i);

            $manager->persist($page);
        }

        $manager->flush();
    }
}

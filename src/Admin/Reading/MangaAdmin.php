<?php

namespace App\Admin\Reading;

use App\Entity\Reading\Page;
use App\Admin\Reading\VolumeAdmin;
use Knp\Menu\ItemInterface;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Admin\AdminInterface;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Form\Type\ModelType;
use Sonata\AdminBundle\Show\ShowMapper;
use Sonata\CoreBundle\Form\Type\DatePickerType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class MangaAdmin extends AbstractAdmin
{
    protected $datagridValues = [
        '_sort_by' => 'position',
    ];

    protected function configureFormFields(FormMapper $formMapper)
    {
        $imageFileHelp = null;
        $pageZipHelp = null;

        if ($object = $this->getSubject()) {
            if ($imageName = $object->getImageName()) {
                $imageFileHelp = '<img src="/upload/mangas/'.$object->getDirectory().'/'.$imageName.'" />';
            }
            $pageZipHelp = $object->getPages()->count().' images';
        }

        $formMapper
            ->add('name')
            ->add('subTitle')
            ->add('description', null, [
                'attr' => [
                    'style' => 'height: 100px',
                ]
            ])
            ->add('visible')
            ->add('enabled')
            ->add('pillPrice')
            ->add('author', ModelType::class)
            ->add('publisher', ModelType::class)
            ->add('categories', null, [
                'by_reference' => false,
            ])
            ->add('position')
            ->add('releaseDate', DatePickerType::class, ['format' => 'dd-MM-yyyy'])
            ->add('imageFile', FileType::class, [
                'required' => false,
                'data_class' => null,
                'help' => $imageFileHelp,
            ])
            ->add('previews', FileType::class, [
                'required' => false,
                'mapped' => false,
                'multiple' => 2,
            ])
            ->add('pagesZip', FileType::class, [
                'required' => false,
                'mapped' => false,
                'help' => $pageZipHelp,
            ])
        ;
    }

    protected function configureShowFields(ShowMapper $showMapper)
    {
        $showMapper
            ->add('name')
        ;
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('name');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('name')
            ->add('visible', null, [
                'editable' => true,
            ])
            ->add('enabled', null, [
                'editable' => true,
            ])
            ->add('position', null, [
                'editable' => true,
            ])
        ;
    }

    protected function configureSideMenu(ItemInterface $menu, $action, AdminInterface $childAdmin = null)
    {
        if (!$childAdmin && !in_array($action, ['edit', 'show'])) {
            return;
        }

        $admin = $this->isChild() ? $this->getParent() : $this;
        $id = $admin->getRequest()->get('id');

        $securityContext = $this->getConfigurationPool()->getContainer()->get('security.authorization_checker');

        if($securityContext->isGranted('ROLE_ADMIN')) {
            $menu->addChild('Manga', $admin->generateMenuUrl('edit', ['id' => $id]));
        } else {
            $menu->addChild('Manga', $admin->generateMenuUrl('show', ['id' => $id]));
        }

        if ($admin->getObject($id)->getPages()->count() > 0) {
            $menu->addChild('Pages', $admin->generateMenuUrl('App\Admin\Reading\Manga\PageAdmin.list', ['id' => $id]));
        } else {
            $menu->addChild('Volumes', $admin->generateMenuUrl('App\Admin\Reading\VolumeAdmin.list', ['id' => $id]));
        }

        if ($childAdmin instanceof VolumeAdmin && $childId = $admin->getRequest()->get('childId')) {
            $menu->addChild('Pages', $childAdmin->generateMenuUrl('App\Admin\Reading\Volume\PageAdmin.list', ['id' => $childId]));
        }
    }

    public function postPersist($object)
    {
        $this->uploadPages($object);
        $this->uploadPreviews($object);
    }

    public function preUpdate($object)
    {
        if ($file = $this->getForm()->get('imageFile')->getData()) {
            $object->setImageName($file->getClientOriginalName());
        }
    }

    public function postUpdate($object)
    {
        $this->uploadPages($object);
        $this->uploadPreviews($object);
    }

    public function uploadPages($object)
    {
        $zipFile = $this->getForm()->get('pagesZip')->getData();

        if ($zipFile) {
            $uploadZipDir = $this->getConfigurationPool()->getContainer()->get('kernel')->getProjectDir(). '/private';
            $uploadPagesDir = $uploadZipDir. '/upload/mangas/'. $object->getSlug() .'/pages/'. $this->getRequest()->get('tl');
            $zipName = $zipFile->getClientOriginalName();
            $zipFile->move($uploadZipDir, $zipName);

            $zip = new \ZipArchive;
            if ($zip->open($uploadZipDir.'/'.$zipName) === true) {
                for($i = 0; $i < $zip->numFiles; $i++) {
                    $fileName = $zip->getNameIndex($i);
                    if (!file_exists($uploadPagesDir)) {
                        mkdir($uploadPagesDir, 0777, true);
                    }
                    copy("zip://".$uploadZipDir.'/'.$zipName."#".$fileName, $uploadPagesDir.'/'.$fileName);

                    $page = $this->getConfigurationPool()->getContainer()->get('doctrine')->getRepository(Page::class)->findOneByReadingSupportAndName($object, $fileName);

                    if (!$page) {
                        $page = new Page();
                        $page->setName($fileName);
                        $page->setPosition(explode('.', $fileName, 2)[0]);
                        $object->addPage($page);
                    }
                }
                $zip->close();
            }

            unlink($uploadZipDir.'/'.$zipName);

            $em = $this->modelManager->getEntityManager(get_class($object));
            $em->persist($object);
            $em->flush();
        }
    }

    public function uploadPreviews($object)
    {
        $previews = $this->getForm()->get('previews')->getData();

        if ($previews) {
            $previewsDir = $this->getConfigurationPool()->getContainer()->get('kernel')->getProjectDir().'/public/upload/mangas/'. $object->getDirectory() .'/previews/'. $this->getRequest()->get('tl') .'/';

            if (is_dir($previewsDir)) {
                $oldPreviews = array_diff(scandir($previewsDir), ['.', '..']);
                foreach ($oldPreviews as $key => $value) {
                    unlink($previewsDir.$value);
                }
            }

            foreach ($previews as $preview) {
                $previewName = $preview->getClientOriginalName();
                $preview->move($previewsDir, $previewName);
            }
        }
    }

    public function createQuery($context = 'list')
    {
        $query = parent::createQuery($context);
        $securityContext = $this->getConfigurationPool()->getContainer()->get('security.authorization_checker');
        $tokenStorage = $this->getConfigurationPool()->getContainer()->get('security.token_storage');

        if($securityContext->isGranted('ROLE_ADMIN'))
            return $query;
        else {
            $query
                ->leftJoin($query->getRootAliases()[0] .'.publisher', 'publisher')
                ->where('publisher.account = :user')
                ->setParameter('user', $tokenStorage->getToken()->getUser())
            ;
            return $query;
        }
    }
}

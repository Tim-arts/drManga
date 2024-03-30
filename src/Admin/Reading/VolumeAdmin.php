<?php

namespace App\Admin\Reading;

use App\Entity\Reading\Page;
use Knp\Menu\ItemInterface;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Admin\AdminInterface;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Symfony\Component\Form\Extension\Core\Type\FileType;

class VolumeAdmin extends AbstractAdmin
{
    protected $datagridValues = [
        '_sort_by' => 'position',
    ];

    public function configure()
    {
        $this->parentAssociationMapping = 'manga';
    }

    protected function configureFormFields(FormMapper $formMapper)
    {
        $imageFileHelp = null;
        $pageZipHelp = null;

        if ($object = $this->getSubject()) {
            if ($imageName = $object->getImageName()) {
                $imageFileHelp = '<img src="/upload/mangas/'.$object->getManga()->getDirectory().'/volumes/'. $object->getDirectory() .'/'. $imageName.'" />';
            }
            $pageZipHelp = $object->getPages()->count().' images';
        }

        $formMapper
            ->add('manga')
            ->add('subTitle')
            ->add('description')
            ->add('visible')
            ->add('enabled')
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

    public function prePersist($object)
    {
        $volumesNumber = $object->getManga()->getVolumes()->count();
        $object->setName("Volume " . ($volumesNumber + 1));
        $object->setPosition($volumesNumber + 1);
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
            $uploadPagesDir = $uploadZipDir. '/upload/mangas/'. $object->getManga()->getSlug() .'/volumes/'. $object->getSlug() .'/pages/'. $this->getRequest()->get('tl');
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
            $previewsDir = $this->getConfigurationPool()->getContainer()->get('kernel')->getProjectDir().'/public/upload/mangas/'. $object->getManga()->getDirectory() .'/volumes/'. $object->getDirectory() .'/previews/'. $this->getRequest()->get('tl') .'/';

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
}

<?php

namespace App\Admin\Reading;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Symfony\Component\Form\Extension\Core\Type\FileType;

class CategoryAdmin extends AbstractAdmin
{
    protected function configureFormFields(FormMapper $formMapper)
    {
        $imagePath = $this->getSubject()->getImageName();
        $imageFieldOptions = ['required' => false, 'help' => '<img src="/upload/categories/'.$imagePath.'" />', 'data_class' => null];

        $formMapper
            ->add('name')
            ->add('imageFile', FileType::class, ['required' => false, 'data_class' => null]);
            if (!empty($imagePath)) {
                $formMapper->add('imageFile', FileType::class, $imageFieldOptions);
            }
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('name');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper->addIdentifier('name');
        $listMapper->addIdentifier('imageName');
    }

    public function preUpdate($object)
    {
        if ($file = $this->getForm()->get('imageFile')->getData()) {
            $object->setImageName($file->getClientOriginalName());
        }
    }
}

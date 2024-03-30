<?php

namespace App\Admin\Slider;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Symfony\Component\Form\Extension\Core\Type\FileType;

class MangaSlideAdmin extends AbstractAdmin
{
    protected $datagridValues = [
        '_sort_by' => 'position',
    ];

    protected function configureFormFields(FormMapper $formMapper)
    {
        $imagePath = $this->getSubject()->getImageName();
        $imageFieldOptions = ['required' => false, 'help' => '<img src="/upload/sliders/'. $imagePath.'" />', 'data_class' => null];

        $formMapper
            ->add('url')
            ->add('position')
            ->add('imageFile', FileType::class, ['required' => false, 'data_class' => null]);
            if (!empty($imagePath)) {
                $formMapper->add('imageFile', FileType::class, $imageFieldOptions);
            }
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('id')
            ->add('url')
        ;
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('id')
            ->add('position', null, ['editable' => true])
            ->add('url')
        ;
    }

    public function preUpdate($object)
    {
        if ($file = $this->getForm()->get('imageFile')->getData()) {
            $object->setImageName($file->getClientOriginalName());
        }
    }
}

<?php

namespace App\Admin\Reading;

use Gedmo\Translatable\TranslatableListener;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Model\ModelManagerInterface;

class AbstractPageAdmin extends AbstractAdmin
{
    protected $translatableListener;

    protected $datagridValues = [
        '_page' => 1,
        '_sort_order' => 'ASC',
        '_sort_by' => 'position',
    ];

    //FIXME: Dégueulasse, mais sinon le prix de la page est de 0
    public function setModelManager(ModelManagerInterface $modelManager)
    {
        $evm = $modelManager->getEntityManager('App:Reading\Page')->getEventManager();
        $this->translatableListener->setPersistDefaultLocaleTranslation(false);
        $evm->addEventSubscriber($this->translatableListener);

        $this->modelManager = $modelManager;
    }

    public function setTranslatableListener(TranslatableListener $translatableListener)
    {
        $this->translatableListener = $translatableListener;
    }

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('position')
            ->add('pillPrice')
        ;
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper->add('position');
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('name')
            ->add('position')
        ;
    }

    public function createQuery($context = 'list')
    {
        $query = parent::createQuery($context);

        return $query;
    }
}

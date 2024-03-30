<?php

namespace App\Entity\Commerce;

use App\Entity\Reading\Page;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Mapping as ORM;
use Sonata\TranslationBundle\Model\Gedmo\AbstractPersonalTranslation;

/**
 * @ORM\Entity
 * @ORM\Table(name="commerce_product_translation", uniqueConstraints={
 * @ORM\UniqueConstraint(name="lookup_unique_idx", columns={"locale", "object_id", "field"})})
 * @ORM\HasLifecycleCallbacks()
 */
class ProductTranslation extends AbstractPersonalTranslation
{
    /**
     * @ORM\ManyToOne(targetEntity="Product", inversedBy="translations")
     * @ORM\JoinColumn(name="object_id", referencedColumnName="id", onDelete="CASCADE")
     */
    protected $object;

    /**
     * @ORM\PostPersist
     */
    public function removePageTranslation(LifecycleEventArgs $args)
    {
        $entity = $args->getEntity();

        if ($entity->getObject() instanceof Page) {
            $args->getObjectManager()->remove($args->getObject());
        }
    }
}

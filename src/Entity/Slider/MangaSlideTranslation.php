<?php

namespace App\Entity\Slider;

use Doctrine\ORM\Mapping as ORM;
use Sonata\TranslationBundle\Model\Gedmo\AbstractPersonalTranslation;

/**
 * @ORM\Entity
 * @ORM\Table(name="slider_manga_slide_translation", uniqueConstraints={
 * @ORM\UniqueConstraint(name="lookup_unique_idx", columns={"locale", "object_id", "field"})})
 */
class MangaSlideTranslation extends AbstractPersonalTranslation
{
    /**
     * @ORM\ManyToOne(targetEntity="MangaSlide", inversedBy="translations")
     * @ORM\JoinColumn(name="object_id", referencedColumnName="id", onDelete="CASCADE")
     */
    protected $object;
}

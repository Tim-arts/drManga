<?php

namespace App\Entity\Slider;

use App\Entity\Reading\Manga;
use App\Entity\Slider\Slide;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity(repositoryClass="App\Repository\Slider\MangaSlideRepository")
 * @Gedmo\TranslationEntity(class="MangaSlideTranslation")
 * @ORM\Table(name="slider_manga_slide")
 */
class MangaSlide extends Slide
{
    /**
     * @ORM\OneToMany(targetEntity="MangaSlideTranslation", mappedBy="object", cascade={"persist", "remove"})
     */
     protected $translations;

     /**
      * @ORM\Column(type="string", length=255)
      */
     private $url;

    public function __toString()
    {
        return 'MangaSlide';
    }

    public function __construct()
    {
        parent::__construct();
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): self
    {
        $this->url = $url;

        return $this;
    }
}

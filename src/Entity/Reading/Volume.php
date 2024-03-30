<?php

namespace App\Entity\Reading;

use App\Entity\Commerce\Product;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * @ORM\Entity(repositoryClass="App\Repository\Reading\VolumeRepository")
 * @ORM\Table(name="reading_volume")
 * @Vich\Uploadable
 */
class Volume extends ReadingSupport
{
    /**
     * @ORM\Column(type="string", length=100)
     * @Gedmo\Slug(fields={"name"}, unique=false)
     * @Gedmo\Translatable
     */
    protected $slug;

    /**
     * @ORM\Column(type="string", length=30)
     * @Gedmo\Slug(fields={"name"}, unique=false, updatable=false)
     */
    protected $directory;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Reading\Manga", inversedBy="volumes")
     * @ORM\JoinColumn(nullable=false)
     */
    protected $manga;

    /**
    * @Vich\UploadableField(mapping="reading.volume.image", fileNameProperty="imageName")
    *
    * @var File
    */
   protected $imageFile;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Reading\Page", mappedBy="volume", cascade={"persist", "remove"})
     */
    protected $pages;

    public function __toString()
    {
        return $this->name ?? 'Manga';
    }

    public function __construct()
    {
        parent::__construct();
        $this->pages = new ArrayCollection();
    }

    public function getManga(): ?Manga
    {
        return $this->manga;
    }

    public function setManga(?Manga $manga): self
    {
        $this->manga = $manga;

        return $this;
    }

    public function addPage(Page $page): self
    {
        if (!$this->pages->contains($page)) {
            $this->pages[] = $page;
            $page->setVolume($this);
        }

        return $this;
    }

    public function removePage(Page $page): self
    {
        if ($this->pages->contains($page)) {
            $this->pages->removeElement($page);
            // set the owning side to null (unless already changed)
            if ($page->getVolume() === $this) {
                $page->setVolume(null);
            }
        }

        return $this;
    }
}

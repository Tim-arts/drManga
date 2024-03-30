<?php

namespace App\Entity\Reading;

use App\Entity\Commerce\Product;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\Sluggable\Util\Urlizer;
use Symfony\Component\HttpFoundation\File\File;

abstract class ReadingSupport extends Product implements ReadingSupportInterface
{
    /**
     * @ORM\Column(type="string", length=100)
     * @Gedmo\Slug(fields={"name"})
     * @Gedmo\Translatable
     */
    protected $slug;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     * @Gedmo\Translatable
     */
    protected $subTitle;

    /**
     * @ORM\Column(type="string", length=30)
     * @Gedmo\Slug(fields={"name"}, updatable=false)
     */
    protected $directory;

    /**
     * @ORM\Column(type="string", length=30, nullable=true)
     * @Gedmo\Translatable
     */
    protected $imageName;

    /**
     * @ORM\Column(type="integer")
     */
    protected $position = 1;

    public function __construct()
    {
        parent::__construct();
    }

    public function getManga()
    {
        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): self
    {
        $this->slug = $slug;

        return $this;
    }

    public function getSubTitle(): ?string
    {
        return $this->subTitle;
    }

    public function setSubTitle(?string $subTitle): self
    {
        $this->subTitle = $subTitle;

        return $this;
    }

    public function getDirectory(): ?string
    {
        if (!$this->directory) {
            return Urlizer::urlize($this->getName());
        }

        return $this->directory;
    }

    public function setDirectory(string $directory): self
    {
        $this->directory = $directory;

        return $this;
    }

    public function getImageName(): ?string
    {
        return $this->imageName;
    }

    public function setImageName(?string $imageName): self
    {
        $this->imageName = $imageName;

        return $this;
    }

    /**
     * @param File|\Symfony\Component\HttpFoundation\File\UploadedFile $image
     */
    public function setImageFile(?File $image = null): void
    {
        $this->imageFile = $image;

        if ($image) {
            $this->updatedAt = new \DateTimeImmutable();
        }
    }

    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }

    /**
     * @return Collection|Page[]
     */
    public function getPages(): Collection
    {
        return $this->pages;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): self
    {
        $this->position = $position;

        return $this;
    }
}

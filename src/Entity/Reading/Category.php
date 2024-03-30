<?php

namespace App\Entity\Reading;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Sonata\TranslationBundle\Model\Gedmo\AbstractPersonalTranslatable;
use Sonata\TranslationBundle\Model\Gedmo\TranslatableInterface;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * @ORM\Entity(repositoryClass="App\Repository\Reading\CategoryRepository")
 * @ORM\Table(name="reading_category")
 * @Gedmo\TranslationEntity(class="CategoryTranslation")
 * @Vich\Uploadable
 */
class Category extends AbstractPersonalTranslatable implements TranslatableInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=30)
     * @Gedmo\Translatable
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=30)
     * @Gedmo\Slug(fields={"name"})
     * @Gedmo\Translatable
     */
    private $slug;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     *
     * @var \DateTime
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="string", length=30, nullable=true)
     * @Gedmo\Translatable
     */
    protected $imageName;

    /**
    * @Vich\UploadableField(mapping="reading.category.image", fileNameProperty="imageName")
    *
    * @var File
    */
   private $imageFile;

   /**
    * @ORM\ManyToMany(targetEntity="App\Entity\Reading\Manga", inversedBy="categories")
    * @ORM\JoinTable(name="reading_category_manga")
    */
   private $mangas;

   /**
    * @ORM\OneToMany(targetEntity="CategoryTranslation", mappedBy="object", cascade={"persist", "remove"})
    */
    protected $translations;

   public function __toString()
   {
       return $this->name ?? 'Category';
   }

   public function __construct()
   {
       $this->mangas = new ArrayCollection();
   }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

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
     * @return Collection|Manga[]
     */
    public function getMangas(): Collection
    {
        return $this->mangas;
    }

    public function addManga(Manga $manga): self
    {
        if (!$this->mangas->contains($manga)) {
            $this->mangas[] = $manga;
        }

        return $this;
    }

    public function removeManga(Manga $manga): self
    {
        if ($this->mangas->contains($manga)) {
            $this->mangas->removeElement($manga);
        }

        return $this;
    }
}

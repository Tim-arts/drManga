<?php

namespace App\Entity\Reading;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\HttpFoundation\File\File;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * @ORM\Entity(repositoryClass="App\Repository\Reading\MangaRepository")
 * @ORM\Table(name="reading_manga")
 * @Vich\Uploadable
 */
class Manga extends ReadingSupport
{
    /**
    * @Vich\UploadableField(mapping="reading.manga.image", fileNameProperty="imageName")
    *
    * @var File
    */
   protected $imageFile;

   /**
    * @ORM\ManyToOne(targetEntity="App\Entity\Reading\Author", inversedBy="mangas")
    * @ORM\JoinColumn(nullable=false)
    */
   protected $author;

   /**
    * @ORM\ManyToMany(targetEntity="App\Entity\Reading\Category", mappedBy="mangas")
    */
   protected $categories;

   /**
    * @ORM\Column(type="date", nullable=true)
    */
   protected $releaseDate;

   /**
    * @ORM\Column(type="decimal", precision=2, scale=1)
    */
   protected $note = 2.5;

   /**
    * @ORM\Column(type="integer")
    * @Gedmo\SortablePosition
    */
   protected $position = 1;

   /**
    * @ORM\OneToMany(targetEntity="App\Entity\Reading\Volume", mappedBy="manga", cascade={"persist"})
    */
   protected $volumes;

   /**
    * @ORM\OneToMany(targetEntity="App\Entity\Reading\Page", mappedBy="manga", cascade={"persist", "remove"})
    */
   protected $pages;

   /**
    * @ORM\OneToMany(targetEntity="App\Entity\Reading\MangaUser", mappedBy="manga")
    */
   protected $mangaUsers;

   /**
    * @ORM\ManyToOne(targetEntity="App\Entity\Reading\Publisher", inversedBy="mangas")
    * @ORM\JoinColumn(nullable=false)
    */
   protected $publisher;

   public function __toString()
   {
       return $this->name ?? 'Manga';
   }

   public function __construct()
   {
       parent::__construct();
       $this->categories = new ArrayCollection();
       $this->volumes = new ArrayCollection();
       $this->pages = new ArrayCollection();
       $this->mangaUsers = new ArrayCollection();
   }

    public function getAuthor(): ?Author
    {
        return $this->author;
    }

    public function setAuthor(?Author $author): self
    {
        $this->author = $author;

        return $this;
    }

    /**
     * @return Collection|Category[]
     */
    public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function addCategory(Category $category): self
    {
        if (!$this->categories->contains($category)) {
            $this->categories[] = $category;
            $category->addManga($this);
        }

        return $this;
    }

    public function removeCategory(Category $category): self
    {
        if ($this->categories->contains($category)) {
            $this->categories->removeElement($category);
            $category->removeManga($this);
        }

        return $this;
    }

    public function getReleaseDate(): ?\DateTimeInterface
    {
        return $this->releaseDate;
    }

    public function setReleaseDate(?\DateTimeInterface $releaseDate): self
    {
        $this->releaseDate = $releaseDate;

        return $this;
    }

    /**
     * @return Collection|Volume[]
     */
    public function getVolumes(): Collection
    {
        return $this->volumes;
    }

    /**
     * @return Collection|Volume[]
     */
    public function getVisibleVolumes(): Collection
    {
        return $this->volumes->filter(function(Volume $volume) {
            return $volume->isVisible();
        });
    }

    public function addVolume(Volume $volume): self
    {
        if (!$this->volumes->contains($volume)) {
            $this->volumes[] = $volume;
            $volume->setManga($this);
        }

        return $this;
    }

    public function removeVolume(Volume $volume): self
    {
        if ($this->volumes->contains($volume)) {
            $this->volumes->removeElement($volume);
            // set the owning side to null (unless already changed)
            if ($volume->getManga() === $this) {
                $volume->setManga(null);
            }
        }

        return $this;
    }

    public function addPage(Page $page): self
    {
        if (!$this->pages->contains($page)) {
            $this->pages[] = $page;
            $page->setManga($this);
        }

        return $this;
    }

    public function removePage(Page $page): self
    {
        if ($this->pages->contains($page)) {
            $this->pages->removeElement($page);
            // set the owning side to null (unless already changed)
            if ($page->getManga() === $this) {
                $page->setManga(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|MangaUser[]
     */
    public function getMangaUsers(): Collection
    {
        return $this->mangaUsers;
    }

    public function addMangaUser(MangaUser $mangaUser): self
    {
        if (!$this->mangaUsers->contains($mangaUser)) {
            $this->mangaUsers[] = $mangaUser;
            $mangaUser->setManga($this);
        }

        return $this;
    }

    public function removeMangaUser(MangaUser $mangaUser): self
    {
        if ($this->mangaUsers->contains($mangaUser)) {
            $this->mangaUsers->removeElement($mangaUser);
            // set the owning side to null (unless already changed)
            if ($mangaUser->getManga() === $this) {
                $mangaUser->setManga(null);
            }
        }

        return $this;
    }

    public function getNote()
    {
        return $this->note;
    }

    public function setNote($note): self
    {
        $this->note = $note;

        return $this;
    }

    public function getPublisher(): ?Publisher
    {
        return $this->publisher;
    }

    public function setPublisher(?Publisher $publisher): self
    {
        $this->publisher = $publisher;

        return $this;
    }
}

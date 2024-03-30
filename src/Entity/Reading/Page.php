<?php

namespace App\Entity\Reading;

use App\Entity\Commerce\Product;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\Reading\PageRepository")
 * @ORM\Table(name="reading_page")
 */
class Page extends Product
{
    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Reading\Manga", inversedBy="pages")
     */
    private $manga;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Reading\Volume", inversedBy="pages")
     */
    private $volume;

    /**
     * @ORM\Column(type="integer")
     */
    private $position;

    public function getManga(): ?Manga
    {
        return $this->manga ?? ($this->getVolume() ? $this->getVolume()->getManga() : null);
    }

    public function setManga(?Manga $manga): self
    {
        $this->manga = $manga;

        return $this;
    }

    public function getVolume(): ?Volume
    {
        return $this->volume;
    }

    public function setVolume(?Volume $volume): self
    {
        $this->volume = $volume;

        return $this;
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

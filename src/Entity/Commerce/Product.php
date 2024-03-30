<?php

namespace App\Entity\Commerce;

use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Sonata\TranslationBundle\Model\Gedmo\AbstractPersonalTranslatable;
use Sonata\TranslationBundle\Model\Gedmo\TranslatableInterface;

/**
 * @ORM\Entity(repositoryClass="App\Repository\Commerce\ProductRepository")
 * @ORM\Table(name="commerce_product")
 * @ORM\InheritanceType("JOINED")
 * @Gedmo\TranslationEntity(class="ProductTranslation")
 * @ORM\DiscriminatorColumn(name="discr", type="string")
 */
class Product extends AbstractPersonalTranslatable implements TranslatableInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=100)
     * @Gedmo\Translatable
     */
    protected $name;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Gedmo\Translatable
     */
    protected $description;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $updatedAt;

    /**
     * @ORM\Column(type="boolean")
     * @Gedmo\Translatable
     */
    protected $visible;

    /**
     * @ORM\Column(type="boolean")
     * @Gedmo\Translatable
     */
    protected $enabled;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=2, nullable=true)
     */
    protected $price;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Gedmo\Translatable
     */
    protected $pillPrice;

    /**
     * @ORM\OneToMany(targetEntity="ProductTranslation", mappedBy="object", cascade={"persist", "remove"})
     */
     protected $translations;

    public function __construct()
    {
        parent::__construct();
        $this->createdAt = new \DateTime();
        $this->visible = true;
        $this->enabled = true;
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function isVisible(): ?bool
    {
        return $this->visible;
    }

    public function setVisible(bool $visible): self
    {
        $this->visible = $visible;

        return $this;
    }

    public function isEnabled(): ?bool
    {
        return $this->enabled;
    }

    public function setEnabled(bool $enabled): self
    {
        $this->enabled = $enabled;

        return $this;
    }

    public function getPrice()
    {
        return $this->price;
    }

    public function setPrice($price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getPillPrice()
    {
        return $this->pillPrice;
    }

    public function setPillPrice($pillPrice): self
    {
        $this->pillPrice = $pillPrice;

        return $this;
    }
}

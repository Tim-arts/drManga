<?php

namespace App\Entity\Commerce;

use App\Entity\Commerce\Product;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\Commerce\PillOfferRepository")
 * @ORM\Table(name="commerce_pill_offer")
 */
class PillOffer extends Product
{
    /**
     * @ORM\Column(type="string", length=20)
     */
    private $color;

    public function __construct(string $name = null, float $price = null, int $pillPrice = null, string $color = null)
    {
        parent::__construct();
        $this->name = $name;
        $this->price = $price;
        $this->pillPrice = $pillPrice;
        $this->color = $color;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(string $color): self
    {
        $this->color = $color;

        return $this;
    }
}

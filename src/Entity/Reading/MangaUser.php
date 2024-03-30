<?php

namespace App\Entity\Reading;

use App\Entity\UserManagement\User;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\Reading\MangaUserRepository")
 * * @ORM\Table(name="reading_manga_user")
 */
class MangaUser
{
    public static $STATUS = [
        'STARTED' => 0,
        'FINISHED' => 1,
        'WAITING' => 2,
    ];

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Reading\Manga", inversedBy="mangaUsers")
     * @ORM\JoinColumn(nullable=false)
     */
    private $manga;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\UserManagement\User", inversedBy="mangaUsers")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    /**
     * @ORM\Column(type="decimal", precision=2, scale=1, nullable=true)
     */
    private $vote;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Reading\Page")
     */
    private $bookmark;

    /**
     * @ORM\Column(type="smallint")
     */
    private $status;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getVote(): ?float
    {
        return $this->vote;
    }

    public function setVote(?float $vote): self
    {
        $this->vote = $vote;

        return $this;
    }

    public function getBookmark(): ?Page
    {
        return $this->bookmark;
    }

    public function setBookmark(?Page $bookmark): self
    {
        $this->bookmark = $bookmark;

        return $this;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): self
    {
        $this->status = $status;

        return $this;
    }
}

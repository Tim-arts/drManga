<?php

namespace App\Entity\UserManagement;

use App\Entity\Commerce\Order;
use App\Entity\Reading\Manga;
use App\Entity\Reading\MangaUser;
use App\Entity\Reading\ReadingSupport;
use App\Entity\Reading\Page;
use App\Entity\Reading\Volume;
use App\Entity\Reading\ReadingSupportInterface;
use App\Entity\UserManagement\User\Settings;
use App\Entity\UserManagement\User\Tracking;
use App\Validator\Constraints as AcmeAssert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Model\User as BaseUser;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserManagement\UserRepository")
 * @ORM\Table(name="user_management_user")
 * @ORM\HasLifecycleCallbacks()
 * @Vich\Uploadable
 */
class User extends BaseUser
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    protected $id;

    /**
     * @Assert\Length(
     *      min = 3,
     *      max = 20,
     *  )
     *  @AcmeAssert\ContainsAlphanumeric(
     *      message = "username.contains_alphanumeric"
     * )
     */
    protected $username;

    /**
     * @Assert\Length(
     *      min = 7,
     *      max = 30,
     *      minMessage = "password.short",
     *      maxMessage = "password.long"
     * )
     * @AcmeAssert\StrongPassword(
     *      message = "Au moins un chiffre et une lettre"
     * )
     */
    protected $plainPassword;

    /**
     * @ORM\Column(type="integer")
     */
    private $pills = 0;

    /**
     * @ORM\Column(type="integer")
     */
    private $pillsBought = 0;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $updatedAt;

    /**
     * @ORM\Column(type="string", length=30, nullable=true)
     */
    protected $avatarName;

    /**
    * @Vich\UploadableField(mapping="user_management.user.avatar", fileNameProperty="avatarName")
    * @Assert\Image(
    *   maxSize = "1024k",
    *   maxSizeMessage = "too fat"
    * )
    *
    * @var Image
    */
   private $avatarFile;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $securionCustomerId;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Commerce\Order", mappedBy="user", orphanRemoval=true)
     */
    private $orders;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $birthdate;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Reading\Page")
     * @ORM\JoinTable(name="reading_user_page")
     */
    private $pages;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Reading\MangaUser", mappedBy="user")
     */
    private $mangaUsers;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\UserManagement\User\Settings", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $settings;

    /**
     * @ORM\Column(type="boolean")
     */
    private $locked = 0;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $createdAt;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\UserManagement\User\Tracking", mappedBy="user", cascade={"persist"})
     */
    private $trackings;

    public function __construct()
    {
        parent::__construct();
        $this->settings = new Settings();
        $this->orders = new ArrayCollection();
        $this->pages = new ArrayCollection();
        $this->mangaUsers = new ArrayCollection();
        $this->trackings = new ArrayCollection();
    }

    /**
     * Return the id
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPills()
    {
        return $this->pills;
    }

    public function setPills($pills): self
    {
        $this->pills = $pills;

        return $this;
    }

    public function addPills($pills): self
    {
        $this->pills += $pills;

        return $this;
    }

    public function removePills($pills): void
    {
        $this->pills -= $pills;
    }

    public function getAvatarName(): ?string
    {
        return $this->avatarName;
    }

    public function setAvatarName(?string $avatarName): self
    {
        $this->avatarName = $avatarName;

        return $this;
    }

    /**
     * @param File|\Symfony\Component\HttpFoundation\File\UploadedFile $avatar
     */
    public function setAvatarFile(?File $avatar = null): void
    {
        $this->avatarFile = $avatar;

        if ($avatar) {
            $this->updatedAt = new \DateTimeImmutable();
        }
    }

    public function getAvatarFile(): ?File
    {
        return $this->avatarFile;
    }

    public function getSecurionCustomerId(): ?string
    {
        return $this->securionCustomerId;
    }

    public function setSecurionCustomerId(?string $securionCustomerId): self
    {
        $this->securionCustomerId = $securionCustomerId;

        return $this;
    }

    /**
     * @return Collection|Order[]
     */
    public function getOrders(): Collection
    {
        return $this->orders;
    }

    public function addOrder(Order $order): self
    {
        if (!$this->orders->contains($order)) {
            $this->orders[] = $order;
            $order->setUser($this);
        }

        return $this;
    }

    public function removeOrder(Order $order): self
    {
        if ($this->orders->contains($order)) {
            $this->orders->removeElement($order);
            // set the owning side to null (unless already changed)
            if ($order->getUser() === $this) {
                $order->setUser(null);
            }
        }

        return $this;
    }

    public function getBirthdate(): ?\DateTimeInterface
    {
        return $this->birthdate;
    }

    public function setBirthdate(?\DateTimeInterface $birthdate): self
    {
        $this->birthdate = $birthdate;

        return $this;
    }

    /**
     * @return Collection|Page[]
     */
    public function getPages(): Collection
    {
        return $this->pages;
    }

    public function addPage(Page $page): self
    {
        if (!$this->pages->contains($page)) {
            $this->pages[] = $page;
        }

        return $this;
    }

    public function removePage(Page $page): self
    {
        if ($this->pages->contains($page)) {
            $this->pages->removeElement($page);
        }

        return $this;
    }

    public function hasPage(?Page $page): bool
    {
        if ($this->pages->contains($page)) {
            return true;
        }

        return false;
    }

    public function getPagesByManga(Manga $manga)
    {
        return $this->pages->filter(function(Page $page) use ($manga) {
            return $page->getManga() == $manga;
        });
    }

    public function getPagesByVolume(Volume $volume)
    {
        return $this->pages->filter(function(Page $page) use ($volume) {
            return $page->getVolume() == $volume;
        });
    }

    public function getPagesByReadingSupport(ReadingSupportInterface $readingSupport)
    {
        if ($readingSupport instanceof Manga) {
            return $this->getPagesByManga($readingSupport);
        }

        return $this->getPagesByVolume($readingSupport);
    }

    public function getLastPageByReadingSupport(ReadingSupportInterface $readingSupport)
    {
        $criteria = Criteria::create()->orderBy(['position' => Criteria::ASC]);

        return $this->getPagesByReadingSupport($readingSupport)->matching($criteria)->last();
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
            $mangaUser->setUser($this);
        }

        return $this;
    }

    public function removeMangaUser(MangaUser $mangaUser): self
    {
        if ($this->mangaUsers->contains($mangaUser)) {
            $this->mangaUsers->removeElement($mangaUser);
            // set the owning side to null (unless already changed)
            if ($mangaUser->getUser() === $this) {
                $mangaUser->setUser(null);
            }
        }

        return $this;
    }

    public function getSettings(): ?Settings
    {
        return $this->settings;
    }

    public function setSettings(Settings $settings): self
    {
        $this->settings = $settings;

        return $this;
    }

    public function getPillsBought()
    {
        return $this->pillsBought;
    }

    public function setPillsBought($pillsBought): self
    {
        $this->pillsBought = $pillsBought;

        return $this;
    }

    public function addPillsBought($pills): self
    {
        $this->pillsBought += $pills;

        return $this;
    }

    public function isLocked(): ?bool
    {
        return $this->locked;
    }

    public function setLocked(bool $locked): self
    {
        $this->locked = $locked;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    /**
     * @ORM\PrePersist
     */
    public function setCreatedAt()
    {
        $this->createdAt = new \DateTime();
    }

    /**
     * @return Collection|Tracking[]
     */
    public function getTrackings(): Collection
    {
        return $this->trackings;
    }

    public function getTracking(string $trackingName)
    {
        foreach ($this->getTrackings() as $tracking) {
            if ($tracking->getName() == $trackingName) {
                return $tracking;
            }
        }
    }

    public function addTracking(Tracking $tracking): self
    {
        if (!$this->trackings->contains($tracking)) {
            $this->trackings[] = $tracking;
            $tracking->setUser($this);
        }

        return $this;
    }

    public function removeTracking(Tracking $tracking): self
    {
        if ($this->trackings->contains($tracking)) {
            $this->trackings->removeElement($tracking);
            // set the owning side to null (unless already changed)
            if ($tracking->getUser() === $this) {
                $tracking->setUser(null);
            }
        }

        return $this;
    }
}

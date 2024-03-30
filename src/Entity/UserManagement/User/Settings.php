<?php

namespace App\Entity\UserManagement\User;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserManagement\User\SettingsRepository")
 * @ORM\Table(name="user_management_user_settings")
 */
class Settings
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="boolean")
     */
    private $subscribedToNewsletter = 0;

    /**
     * @ORM\Column(type="boolean")
     */
    private $emailChecked = 0;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isSubscribedToNewsletter(): ?bool
    {
        return $this->subscribedToNewsletter;
    }

    public function setSubscribedToNewsletter(bool $subscribedToNewsletter): self
    {
        $this->subscribedToNewsletter = $subscribedToNewsletter;

        return $this;
    }

    public function isEmailChecked(): ?bool
    {
        return $this->emailChecked;
    }

    public function setEmailChecked(bool $emailChecked): self
    {
        $this->emailChecked = $emailChecked;

        return $this;
    }
}

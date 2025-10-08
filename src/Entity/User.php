<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: "App\Repository\UserRepository")]
#[ORM\Table(name: 'users')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 180, unique: true)]
    private ?string $username = null;

    #[ORM\Column(type: 'json')]
    private array $roles = [];

    #[ORM\Column(type: 'string')]
    private ?string $password = null;

    #[ORM\OneToMany(targetEntity: RepLog::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $repLogs;

    public function __construct()
    {
        $this->repLogs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;
        return $this;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;
        return $this;
    }

    public function getPassword(): string
    {
        return (string)$this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    public function eraseCredentials(): void
    {
        // np. usuń plainPassword jeśli używasz
    }

    public function getRepLogs(): Collection
    {
        return $this->repLogs;
    }

    public function addRepLog(RepLog $repLog): self
    {
        if (!$this->repLogs->contains($repLog)) {
            $this->repLogs->add($repLog);
            $repLog->setUser($this);
        }
        return $this;
    }

    public function removeRepLog(RepLog $repLog): self
    {
        if ($this->repLogs->removeElement($repLog)) {
            if ($repLog->getUser() === $this) {
                $repLog->setUser(null);
            }
        }
        return $this;
    }

    public function getAvatar(): string
    {
        return 'https://thecatapi.com/api/images/get?format=src&type=gif&r=' . rand(100, 999);
    }
}

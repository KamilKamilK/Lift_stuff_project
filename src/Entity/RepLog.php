<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: "App\Repository\RepLogRepository")]
#[ORM\Table(name: "rep_log")]
class RepLog
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "AUTO")]
    #[ORM\Column(type: "integer")]
    #[Groups(["Default"])]
    private int $id;

    #[ORM\Column(type: "integer")]
    #[Groups(["Default"])]
    #[Assert\NotBlank(message: "How many times did you lift this?")]
    #[Assert\GreaterThan(value: 0, message: "You can certainly lift more than just 0!")]
    private int $reps;

    #[ORM\Column(type: "string", length: 50)]
    #[Groups(["Default"])]
    #[Assert\NotBlank(message: "What did you lift?")]
    private string $item;

    #[ORM\Column(type: "float")]
    #[Groups(["Default"])]
    private float $totalWeightLifted;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "repLogs")]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    // Gettery i settery

    public function getId(): int
    {
        return $this->id;
    }

    public function getReps(): int
    {
        return $this->reps;
    }

    public function setReps(int $reps): self
    {
        $this->reps = $reps;
        return $this;
    }

    public function getItem(): string
    {
        return $this->item;
    }

    public function setItem(string $item): self
    {
        $this->item = $item;
        return $this;
    }

    public function getTotalWeightLifted(): float
    {
        return $this->totalWeightLifted;
    }

    public function setTotalWeightLifted(float $totalWeightLifted): self
    {
        $this->totalWeightLifted = $totalWeightLifted;
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
}


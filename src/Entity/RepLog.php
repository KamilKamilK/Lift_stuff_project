<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: "App\Repository\RepLogRepository")]
#[ORM\Table(name: "rep_log")]
class RepLog
{
    const ITEM_LABEL_PREFIX = 'liftable_thing.';

    const WEIGHT_FAT_CAT = 18;

    private static array $thingsYouCanLift = array(
        'cat' => '9',
        'fat_cat' => self::WEIGHT_FAT_CAT,
        'laptop' => '4.5',
        'coffee_cup' => '.5',
    );
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "AUTO")]
    #[ORM\Column(type: "integer")]
    #[Groups(["Default"])]
    private int $id;

    #[ORM\Column(type: "integer", nullable: true)]
    #[Groups(["Default"])]
    #[Assert\GreaterThan(value: 0, message: "You can certainly lift more than just 0!")]
    #[Assert\NotBlank(message: "How many times did you lift this?")]
    private ?int $reps = null;

    #[ORM\Column(type: "string", length: 50)]
    #[Groups(["Default"])]
    #[Assert\NotBlank(message: "What did you lift?")]
    private string $item;

    #[ORM\Column(type: "float")]
    #[Groups(["Default"])]
    private float $totalWeightLifted = 0.0;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "repLogs")]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    // Gettery i settery

    public function getId(): int
    {
        return $this->id;
    }

    public function getReps(): ?int
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

    public function getItemLabel(): string
    {
        return self::ITEM_LABEL_PREFIX.$this->getItem();
    }

    public function setItem($item): static
    {
        if (!isset(self::$thingsYouCanLift[$item])) {
            throw new \InvalidArgumentException(sprintf('You can\'t lift a "%s"!', $item));
        }

        $this->item = $item;
        $this->calculateTotalLifted();

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

    public static function getThingsYouCanLiftChoices(): array
    {
        $things = array_keys(self::$thingsYouCanLift);
        $choices = array();
        foreach ($things as $thingKey) {
            $choices[self::ITEM_LABEL_PREFIX.$thingKey] = $thingKey;
        }

        return $choices;
    }

    private function calculateTotalLifted(): void
    {
        if (!$this->getItem()) {
            return;
        }

        $reps = $this->getReps();
        if ($reps === null) {
            return;
        }

        $weight = self::$thingsYouCanLift[$this->getItem()];
        $totalWeight = $weight * $reps;

        $this->totalWeightLifted = $totalWeight;
    }
}


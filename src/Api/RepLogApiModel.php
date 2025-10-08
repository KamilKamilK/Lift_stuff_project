<?php

namespace App\Api;

class RepLogApiModel
{
    public $id;

    public $reps;

    public $itemLabel;

    public $totalWeightLifted;

    private array $links = [];

    public function addLink($ref, $url): void
    {
        $this->links[$ref] = $url;
    }

    public function getLinks(): array
    {
        return $this->links;
    }
}

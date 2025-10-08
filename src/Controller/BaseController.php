<?php

declare(strict_types=1);

namespace App\Controller;

use App\Api\RepLogApiModel;
use App\Entity\RepLog;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

abstract class BaseController extends AbstractController
{
    public function __construct(
        protected SerializerInterface $serializer,
        protected TranslatorInterface $translator,
        protected ManagerRegistry $doctrine,
    ) {}

    protected function createApiResponse(mixed $data, int $statusCode = 200): JsonResponse
    {
        $json = $this->serializer->serialize($data, 'json');

        return new JsonResponse($json, $statusCode, [], true);
    }

    protected function getErrorsFromForm(FormInterface $form): array|string
    {
        // Bezpośrednie błędy
        foreach ($form->getErrors() as $error) {
            return $error->getMessage();
        }

        // Zagnieżdżone pola
        $errors = [];
        foreach ($form->all() as $childForm) {
            if ($childForm instanceof FormInterface) {
                $childError = $this->getErrorsFromForm($childForm);
                if ($childError) {
                    $errors[$childForm->getName()] = $childError;
                }
            }
        }

        return $errors;
    }

    protected function createRepLogApiModel(RepLog $repLog): RepLogApiModel
    {
        $model = new RepLogApiModel();
        $model->id = $repLog->getId();
        $model->reps = $repLog->getReps();
        $model->itemLabel = $this->translator->trans($repLog->getItemLabel());
        $model->totalWeightLifted = $repLog->getTotalWeightLifted();

        $model->addLink('_self', $this->generateUrl('rep_log_get', ['id' => $repLog->getId()]));

        return $model;
    }

    protected function findAllUsersRepLogModels(): array
    {
        $repLogs = $this->doctrine->getRepository(RepLog::class)
            ->findBy(['user' => $this->getUser()]);

        return array_map([$this, 'createRepLogApiModel'], $repLogs);
    }
}

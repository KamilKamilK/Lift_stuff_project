<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\RepLog;
use App\Form\Type\RepLogType;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[Route('/reps', name: 'rep_log_')]
class RepLogController extends BaseController
{
    #[Route('', name: 'list', options: ['expose' => true], methods: ['GET'])]
    public function list(): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_REMEMBERED');

        $models = $this->findAllUsersRepLogModels();

        return $this->createApiResponse([
            'items' => $models,
        ]);
    }

    #[Route('/{id}', name: 'get', methods: ['GET'])]
    public function get(RepLog $repLog): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_REMEMBERED');

        if ($repLog->getUser() !== $this->getUser()) {
            throw $this->createAccessDeniedException('Not your record.');
        }

        $apiModel = $this->createRepLogApiModel($repLog);

        return $this->createApiResponse($apiModel);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(RepLog $repLog): Response
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_REMEMBERED');

        if ($repLog->getUser() !== $this->getUser()) {
            throw $this->createAccessDeniedException('You cannot delete someone else’s record.');
        }

        $em = $this->doctrine->getManager();
        $em->remove($repLog);
        $em->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('', name: 'new', methods: ['POST'])]
    public function new(Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_REMEMBERED');

        $data = json_decode($request->getContent(), true);
        if ($data === null) {
            throw new BadRequestHttpException('Invalid JSON');
        }

        $form = $this->createForm(RepLogType::class, new RepLog(), [
            'csrf_protection' => false,
        ]);
        $form->submit($data);

        if (!$form->isValid()) {
            $errors = $this->getErrorsFromForm($form);

            return $this->createApiResponse(['errors' => $errors], Response::HTTP_BAD_REQUEST);
        }

        /** @var RepLog $repLog */
        $repLog = $form->getData();
        $repLog->setUser($this->getUser());

        $em = $this->doctrine->getManager();
        $em->persist($repLog);
        $em->flush();

        $apiModel = $this->createRepLogApiModel($repLog);

        $response = $this->createApiResponse($apiModel);
        $response->headers->set(
            'Location',
            $this->generateUrl('rep_log_get', ['id' => $repLog->getId()])
        );

        return $response;
    }
}

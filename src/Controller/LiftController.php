<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\RepLog;
use App\Entity\User;
use App\Form\Type\RepLogType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/lift', name: 'lift_')]
class LiftController extends BaseController
{
    #[Route('', name: 'index')]
    public function index(Request $request): Response
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_REMEMBERED');

        // Tworzenie formularza dodawania rekordu
        $form = $this->createForm(RepLogType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            if ($form->isValid()) {
                /** @var RepLog $repLog */
                $repLog = $form->getData();
                $repLog->setUser($this->getUser());

                $em = $this->doctrine->getManager();
                $em->persist($repLog);
                $em->flush();

                return $this->redirectToRoute('lift_index');
            }
        }

        $repLogModels = $this->findAllUsersRepLogModels();
        $repLogJson = $this->serializer->serialize($repLogModels, 'json');

        return $this->render('lift/index.html.twig', [
            'form' => $form->createView(),
            'leaderboard' => $this->getLeaders(),
            'repLogsJson' => $repLogJson
        ]);
    }

    private function getLeaders(): array
    {
        $repLogRepo = $this->doctrine->getRepository(RepLog::class);
        $userRepo = $this->doctrine->getRepository(User::class);

        $leaderboardDetails = $repLogRepo->getLeaderboardDetails();

        $leaderboard = [];
        foreach ($leaderboardDetails as $details) {
            $user = $userRepo->find($details['user_id']);
            if (!$user) {
                continue;
            }

            $leaderboard[] = [
                'username' => $user->getUserIdentifier(),
                'weight' => $details['weightSum'],
                'in_cats' => number_format(
                    $details['weightSum'] / RepLog::WEIGHT_FAT_CAT,
                    2
                ),
            ];
        }

        return $leaderboard;
    }
}

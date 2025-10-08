<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\RepLog;
use App\Entity\User;
use App\Form\Type\RepLogType;
use App\Repository\RepLogRepository;
use App\Repository\UserRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/lift', name: 'lift_')]
class LiftController extends BaseController
{
    #[Route('/', name: 'index')]
    public function index(Request $request): Response
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_REMEMBERED');

        // Tworzenie formularza dodawania rekordu
        $form = $this->createForm(RepLogType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            /** @var RepLog $repLog */
            $repLog = $form->getData();
            $repLog->setUser($this->getUser());

            $em = $this->doctrine->getManager();
            $em->persist($repLog);
            $em->flush();

            $this->addFlash('notice', 'Reps crunched!');
            return $this->redirectToRoute('lift_index');
        }

        $currentUser = $this->getUser();

        $repLogs = $this->doctrine
            ->getRepository(RepLog::class)
            ->findBy(['user' => $currentUser]);

        $totalWeight = array_sum(array_map(
            fn(RepLog $rep) => $rep->getTotalWeightLifted(),
            $repLogs
        ));

        $leaderboard = $this->getLeaders();

        return $this->render('lift/index.html.twig', [
            'form' => $form->createView(),
            'repLogs' => $repLogs,
            'totalWeight' => $totalWeight,
            'leaderboard' => $leaderboard,
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

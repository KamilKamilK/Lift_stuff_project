<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\RepLog;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/lift', name: 'lift_')]
class LiftController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(ManagerRegistry $doctrine): Response
    {
        $currentUser = $this->getUser();

        // Pobranie tylko repLogów zalogowanego użytkownika
        $repLogs = $doctrine->getRepository(RepLog::class)
            ->findBy(['user' => $currentUser]);

        $totalWeight = array_sum(array_map(fn($rep) => $rep->getTotalWeightLifted(), $repLogs));

        $allRepLogs = $doctrine->getRepository(RepLog::class)->findAll();

        $leaderboard = [];
        foreach ($allRepLogs as $rep) {
            $user = $rep->getUser();
            $id = $user->getId();
            if (!isset($leaderboard[$id])) {
                $leaderboard[$id] = [
                    'user' => $user,
                    'totalWeight' => 0
                ];
            }
            $leaderboard[$id]['totalWeight'] += $rep->getTotalWeightLifted();
        }

        usort($leaderboard, fn($a, $b) => $b['totalWeight'] <=> $a['totalWeight']);

        return $this->render('lift/index.html.twig', [
            'repLogs' => $repLogs,
            'totalWeight' => $totalWeight,
            'leaderboard' => $leaderboard,
        ]);
    }

    #[Route('/add', name: 'add', methods: ['POST'])]
    public function new(Request $request, ManagerRegistry $doctrine): Response
    {
        $itemLabel = $request->request->get('itemLabel');
        $reps = (int) $request->request->get('reps');
        $weight = (float) $request->request->get('weight');

        $currentUser = $this->getUser(); // <--- pobranie zalogowanego użytkownika

        if ($itemLabel && $reps > 0 && $weight > 0 && $currentUser) {
            $repLog = new RepLog();
            $repLog->setItem($itemLabel);
            $repLog->setReps($reps);
            $repLog->setTotalWeightLifted($reps * $weight);

            $repLog->setUser($currentUser); // <--- przypisanie użytkownika

            $em = $doctrine->getManager();
            $em->persist($repLog);
            $em->flush();

            $this->addFlash('success', 'New lift log added!');
        } else {
            $this->addFlash('error', 'Invalid input!');
        }

        return $this->redirectToRoute('lift_index');
    }

    #[Route('/{id}/edit', name: 'edit', methods: ['POST'])]
    public function edit(int $id, Request $request, ManagerRegistry $doctrine): Response
    {
        $repLog = $doctrine->getRepository(RepLog::class)->find($id);

        if (!$repLog) {
            throw $this->createNotFoundException('Lift log not found');
        }

        $itemLabel = $request->request->get('itemLabel');
        $reps = (int) $request->request->get('reps');
        $weight = (float) $request->request->get('weight');

        if ($itemLabel && $reps > 0 && $weight > 0) {
            $repLog->setItemLabel($itemLabel);
            $repLog->setReps($reps);
            $repLog->setWeight($weight);
            $repLog->setTotalWeightLifted($reps * $weight);

            $doctrine->getManager()->flush();

            $this->addFlash('success', 'Lift log updated!');
        } else {
            $this->addFlash('error', 'Invalid input!');
        }

        return $this->redirectToRoute('lift_index');
    }

    #[Route('/{id}/delete', name: 'delete', methods: ['POST'])]
    public function delete(int $id, Request $request, ManagerRegistry $doctrine): Response
    {
        $repLog = $doctrine->getRepository(RepLog::class)->find($id);

        if (!$repLog) {
            throw $this->createNotFoundException('Lift log not found');
        }

        if ($this->isCsrfTokenValid('delete'.$repLog->getId(), $request->request->get('_token'))) {
            $em = $doctrine->getManager();
            $em->remove($repLog);
            $em->flush();

            $this->addFlash('success', 'Lift log deleted!');
        }

        return $this->redirectToRoute('lift_index');
    }
}

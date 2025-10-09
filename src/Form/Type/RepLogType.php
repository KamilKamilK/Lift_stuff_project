<?php

namespace App\Form\Type;

use App\Entity\RepLog;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RepLogType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('reps', IntegerType::class, [
                'label' => 'Number of reps',
            ])
            ->add('item', ChoiceType::class, [
                'label' => 'What did you lift?',
                'choices' => RepLog::getThingsYouCanLiftChoices(),
                'placeholder' => 'What did you lift?',
                'required' => true,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => RepLog::class,
        ]);
    }
}

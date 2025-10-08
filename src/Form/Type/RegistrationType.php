<?php

namespace App\Form\Type;

class RegistrationType extends RegistrationFormType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        parent::buildForm($builder, $options);

        $builder->add('firstName', TextType::class)
            ->add('lastName', TextType::class)
        ;
    }
}

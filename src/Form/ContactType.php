<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

class ContactType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('department', ChoiceType::class, [
                'label' => 'label.department',
                'choices' => [
                    'Raison du Contact' => [
                        'Support Technique' => 'Support Technique',
                        'Marketing' => 'Marketing',
                        'Réclamation' => 'Réclamation',
                        'Demande de partenariat' => 'Partenariat',
                        'Demander la suppression de son compte' => 'Suppression',
                        'Autres' => 'Autres',
                    ]
                ],
            ])
            ->add('email', EmailType::class, [
                'required' => true,
                'label' => 'form.email',
                'translation_domain' => 'FOSUserBundle',
                'constraints' => [
                    new NotBlank(),
                    new Length([
                        'max' => 30,
                    ])
                ],
            ])
            ->add('subject', TextType::class, [
                'required' => true,
                'label' => 'label.subject',
                'constraints' => [
                    new NotBlank(),
                    new Length([
                        'max' => 30,
                    ])
                ],
            ])
            ->add('message', TextareaType::class, [
                'required' => true,
                'label' => 'label.message',
                'constraints' => [
                    new NotBlank(),
                    new Length([
                        'max' => 500,
                    ])
                ],
            ])
        ;
    }

    public function getBlockPrefix()
    {
        return 'contact';
    }
}

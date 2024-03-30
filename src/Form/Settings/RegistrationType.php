<?php

namespace App\Form\Settings;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;

class RegistrationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('subscribedToNewsletter')
        ;
    }

    public function getBlockPrefix()
    {
        return 'app_user_settings_registration';
    }
}

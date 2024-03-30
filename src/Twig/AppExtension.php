<?php

namespace App\Twig;

use App\Entity\UserManagement\User;
use App\Utils\CurrencyConverter;
use App\Utils\UploadRouter;

class AppExtension extends \Twig_Extension
{
    public $uploadRouter;

    public function __construct(UploadRouter $uploadRouter)
    {
        $this->uploadRouter = $uploadRouter;
    }
    public function getFilters()
    {
        return [
            new \Twig_SimpleFilter('convertToUSD', [$this, 'convertToUSD']),
            new \Twig_SimpleFilter('defaultAvatar', [$this, 'defaultAvatar']),
        ];
    }

    public function convertToUSD($eur): float
    {
        $currencyConverter = new CurrencyConverter();

        return $currencyConverter->EurToUSD($eur);
    }

    public function defaultAvatar(User $user): string
    {
        return $this->uploadRouter->generate($user, 'avatarFile', '/img/users/default-avatar.jpg');
    }
}
?>

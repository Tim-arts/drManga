<?php

namespace App\Controller\Reading;

use App\Entity\Reading\Manga;
use App\Entity\Reading\Page;
use App\Entity\Reading\ReadingSupportInterface;
use App\Entity\Reading\Volume;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PageController extends AbstractController
{
    public function buy()
    {
        
    }
}

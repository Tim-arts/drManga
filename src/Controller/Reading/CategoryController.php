<?php

namespace App\Controller\Reading;

use App\Entity\Reading\Category;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class CategoryController extends AbstractController
{
    /**
     * @Route("/categories/{slug}", name="reading_category_show")
     * @ParamConverter("$category", options={"mapping"={"slug"="slug"}})
     */
    public function show(Category $category)
    {
        return $this->render('reading/category/show.html.twig', [
            'category' => $category,
        ]);
    }
}

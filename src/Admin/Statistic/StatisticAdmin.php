<?php

namespace App\Admin\Statistic;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Route\RouteCollection;

class StatisticAdmin extends AbstractAdmin
{
    protected $baseRoutePattern = 'stats';
    protected $baseRouteName = 'stats';

    protected function configureRoutes(RouteCollection $collection)
    {
        $collection->clearExcept(['list']);
    }
}

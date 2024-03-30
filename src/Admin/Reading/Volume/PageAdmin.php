<?php

namespace App\Admin\Reading\Volume;

use App\Admin\Reading\AbstractPageAdmin;

class PageAdmin extends AbstractPageAdmin
{
    protected $baseRouteName = 'volume_page';
    protected $baseRoutePattern = 'volume_page';

    public function configure()
    {
        $this->parentAssociationMapping = 'volume';
    }
}

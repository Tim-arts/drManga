<?php

namespace App\Admin\Reading\Manga;

use App\Admin\Reading\AbstractPageAdmin;

class PageAdmin extends AbstractPageAdmin
{
    public function configure()
    {
        $this->parentAssociationMapping = 'manga';
    }
}

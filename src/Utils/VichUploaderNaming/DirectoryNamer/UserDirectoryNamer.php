<?php

namespace App\Utils\VichUploaderNaming\DirectoryNamer;

use Vich\UploaderBundle\Mapping\PropertyMapping;
use Vich\UploaderBundle\Naming\DirectoryNamerInterface;

class UserDirectoryNamer implements DirectoryNamerInterface
{
    public function directoryName($user, PropertyMapping $mapping): string
    {
        return $user->getUsernameCanonical();
    }
}

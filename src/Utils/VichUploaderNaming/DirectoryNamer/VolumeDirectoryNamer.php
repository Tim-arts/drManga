<?php

namespace App\Utils\VichUploaderNaming\DirectoryNamer;

use Vich\UploaderBundle\Mapping\PropertyMapping;
use Vich\UploaderBundle\Naming\DirectoryNamerInterface;

class VolumeDirectoryNamer implements DirectoryNamerInterface
{
    public function directoryName($volume, PropertyMapping $mapping): string
    {
        return $volume->getManga()->getDirectory() .'/volumes/'. $volume->getDirectory();
    }
}

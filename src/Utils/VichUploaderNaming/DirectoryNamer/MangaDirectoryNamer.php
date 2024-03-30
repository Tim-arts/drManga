<?php

namespace App\Utils\VichUploaderNaming\DirectoryNamer;

use Vich\UploaderBundle\Mapping\PropertyMapping;
use Vich\UploaderBundle\Naming\DirectoryNamerInterface;

class MangaDirectoryNamer implements DirectoryNamerInterface
{
    public function directoryName($manga, PropertyMapping $mapping): string
    {
        return $manga->getDirectory();
    }
}

<?php

namespace App\Utils;

use Symfony\Component\Routing\RouterInterface;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;

class UploadRouter
{
    /**
     * @var RouterInterface
     */
    private $router;

    /**
     * Vich uploader helper
     * @var UploaderHelper
     */
    private $uploaderHelper;

    /**
    * @param RouterInterface $router
    * @param UploaderHelper $uploaderHelper
    */
    public function __construct(RouterInterface $router, UploaderHelper $uploaderHelper)
    {
        $this->router = $router;
        $this->uploaderHelper = $uploaderHelper;
    }

    public function generate($object, string $fieldName, string $default = null, $baseUrl = false)
    {
        $path = $this->uploaderHelper->asset($object, $fieldName);
        $fileUrl = $baseUrl ? $this->getBaseUrl() : null;
        $fileUrl = $path ?? $default;

        return $fileUrl;
    }

    private function getBaseUrl()
    {
        return $this->router->getContext()->getScheme() . '://' . $this->router->getContext()->getHost();
    }
}

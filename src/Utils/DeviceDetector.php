<?php

namespace App\Utils;

use DeviceDetector\Parser\Device\DeviceParserAbstract;
use Symfony\Component\HttpFoundation\RequestStack;

class DeviceDetector extends \DeviceDetector\DeviceDetector
{
    function __construct(RequestStack $requestStack)
    {
        DeviceParserAbstract::setVersionTruncation(DeviceParserAbstract::VERSION_TRUNCATION_NONE);
        $request = $requestStack->getCurrentRequest();
        if ($request) {
            parent::__construct($request->headers->get('User-Agent'));
        }
        $cache = new \Symfony\Component\Cache\Adapter\FilesystemAdapter();
        $this->setCache(new \DeviceDetector\Cache\PSR6Bridge($cache));
        $this->setYamlParser(new \DeviceDetector\Yaml\Symfony());
        $this->skipBotDetection();
        $this->parse();
    }
}

<?php

namespace App\Utils;

use Symfony\Component\Cache\Simple\FilesystemCache;

class CurrencyConverter
{
    public static function USDToEur(float $dollar): float
    {
        $cache = new FilesystemCache();
        $dollarRate = 1;

        if ($cache->has('dollar_rate')) {
            $dollarRate = $cache->get('dollar_rate');
        } else {
            $xml = simplexml_load_file("http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml");
            $json = json_encode($xml);
            $array = json_decode($json,TRUE);
            $dollarRate = $array["Cube"]["Cube"]["Cube"][0]["@attributes"]["rate"];
            $cache->set('dollar_rate', $dollarRate, 86400);
        }

        return $dollar / $dollarRate;
    }

    public static function EurToErogold(float $euro): float
    {
        return $euro * 100;
    }

    public function EurToUSD(float $eur): float
    {
        $cache = new FilesystemCache();
        $dollarRate = 1;

        if ($cache->has('dollar_rate')) {
            $dollarRate = $cache->get('dollar_rate');
        } else {
            $xml = simplexml_load_file("http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml");
            $json = json_encode($xml);
            $array = json_decode($json,TRUE);
            $dollarRate = $array["Cube"]["Cube"]["Cube"][0]["@attributes"]["rate"];
            $cache->set('dollar_rate', $dollarRate, 86400);
        }

        return round($eur * $dollarRate, 2);
    }
}

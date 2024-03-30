<?php

namespace App\PaymentService;

use App\PaymentService\PaymentServiceInterface;

abstract class AbstractPaymentService implements PaymentServiceInterface
{
    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $privateKey;

    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return string
     */
    public function getPrivateKey(): string
    {
        return $this->privateKey;
    }
}

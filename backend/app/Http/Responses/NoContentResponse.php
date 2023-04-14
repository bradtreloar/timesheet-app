<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

class NoContentResponse extends JsonResponse
{
    /**
     * Constructor.
     *
     * @param  mixed  $data
     * @param  int  $status
     * @param  array  $headers
     * @param  int  $options
     * @return void
     */
    public function __construct($headers = [], $options = 0)
    {
        $this->encodingOptions = $options;
        parent::__construct('', 204, $headers);
    }
}

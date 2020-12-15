<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

class UserDataResponse extends JsonResponse
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
    public function __construct($user, $status = 200, $headers = [], $options = 0)
    {
        $this->encodingOptions = $options;

        $data = [
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'is_admin' => $user->is_admin,
        ];

        parent::__construct($data, $status, $headers);
    }
}

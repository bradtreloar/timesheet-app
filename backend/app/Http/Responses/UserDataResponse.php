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
            'phone_number' => $user->phone_number,
            'accepts_reminders' => $user->accepts_reminders,
            'name' => $user->name,
            'is_admin' => $user->is_admin,
            'default_values' => $user->default_values,
        ];

        parent::__construct($data, $status, $headers);
    }
}

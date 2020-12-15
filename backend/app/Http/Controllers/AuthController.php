<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class AuthController extends Controller
{
    /**
     * Handle an incoming authentication request.
     *
     * @param  \App\Http\Requests\Auth\LoginRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function login(LoginRequest $request)
    {
        $request->authenticate();
        $request->session()->regenerate();
        $user = $request->user();
        return new JsonResponse(
            [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'is_admin' => $user->is_admin,
            ],
            200
        );
    }

    /**
     * Destroy an authenticated session.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return new Response(204);
    }

    /**
     * Handle request for current user's details
     */
    public function currentUser(Request $request)
    {
        $user = $request->user();
        if ($user) {
            return new JsonResponse(
                [
                    'id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->name,
                    'is_admin' => $user->is_admin,
                ],
                200
            );
        } else {
            return new JsonResponse(null, 204);
        }
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(
            [
                'email' => 'required|email',
            ]
        );

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            return new Response('', 204);
        } else {
            throw new BadRequestException();
        }
    }
}

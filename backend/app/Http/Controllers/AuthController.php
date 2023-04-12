<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Responses\NoContentResponse;
use App\Http\Responses\UserDataResponse;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $request->authenticate();
        $request->session()->regenerate();
        $user = $request->user();
        return new UserDataResponse($user);
    }

    public function logout(Request $request)
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return new NoContentResponse();
    }

    public function currentUser(Request $request)
    {
        $user = $request->user();
        if ($user) {
            return new UserDataResponse($user);
        } else {
            return new JsonResponse(null, 204);
        }
    }

    /**
     * Handle an incoming password reset link request.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            return new NoContentResponse();
        } elseif ($status == Password::INVALID_USER) {
            throw new UnprocessableEntityHttpException();
        } elseif ($status == Password::RESET_THROTTLED) {
            throw new ThrottleRequestsException();
        } else {
            throw new BadRequestException();
        }
    }

    /**
     * Handle an incoming new password request.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|string|min:10',
        ]);

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $status = Password::reset(
            $request->only('email', 'password', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return new NoContentResponse();
        } else {
            throw new BadRequestException();
        }
    }

    /**
     * Handle an password change by the current user.
     */
    public function setPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:8',
        ]);

        $user = $request->user();
        $user->password = Hash::make($request->password);
        $user->save();

        return new NoContentResponse();
    }
}
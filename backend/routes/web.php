<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Named route required for password reset email.
// @see Illuminate\Auth\Notifications\ResetPassword::toMail
Route::get('/reset-password/{token}', function () {
    throw new NotFoundHttpException();
})->name('password.reset');

<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TimesheetController;
use CloudCreativity\LaravelJsonApi\Facades\JsonApi;
use CloudCreativity\LaravelJsonApi\Routing\RouteRegistrar;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', [AuthController::class, 'login']);

Route::post('logout', [AuthController::class, 'logout'])
    ->middleware('auth:api');

Route::get('user', [AuthController::class, 'currentUser']);

Route::post('forgot-password', [AuthController::class, 'forgotPassword']);

Route::post('reset-password', [AuthController::class, 'resetPassword']);

JsonApi::register('default')
    ->middleware('auth:api')
    ->routes(
        function (RouteRegistrar $api) {
            $api->resource('users')->relationships(
                function ($relations) {
                    $relations->hasMany('timesheets');
                }
            );
            $api->resource('timesheets')->relationships(
                function ($relations) {
                    $relations->hasMany('shifts');
                    $relations->hasOne('user');
                }
            );
            $api->resource('shifts')->relationships(
                function ($relations) {
                    $relations->hasOne('timesheet');
                }
            );
            $api->resource('settings');
        }
    );

Route::post('timesheets/{timesheet}/complete', [
    TimesheetController::class, 'complete'
])->middleware('auth:api');

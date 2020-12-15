<?php

use App\Http\Controllers\AuthController;
use CloudCreativity\LaravelJsonApi\Facades\JsonApi;
use CloudCreativity\LaravelJsonApi\Routing\RouteRegistrar;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
Route::post('logout', [AuthController::class, 'logout']);
Route::get('user', [AuthController::class, 'currentUser']);

JsonApi::register('default')
    ->middleware('auth:sanctum')
    ->routes(function (RouteRegistrar $api) {
        $api->resource('users')->relationships(function ($relations) {
            $relations->hasMany('timesheets');
        });
        $api->resource('timesheets')->relationships(function ($relations) {
            $relations->hasMany('shifts');
            $relations->hasOne('user');
        });
        $api->resource('shifts')->relationships(function ($relations) {
            $relations->hasOne('timesheet');
        });
        $api->resource('settings');
    });

<?php

use App\Http\Middleware\CheckAccess;
use CloudCreativity\LaravelJsonApi\Facades\JsonApi;
use CloudCreativity\LaravelJsonApi\Routing\RouteRegistrar;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

JsonApi::register('default')
    ->middleware('auth')
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
    });

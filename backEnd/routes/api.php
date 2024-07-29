<?php

use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('login', [LoginController::class, 'login'])->name('api.login')
    ->withoutMiddleware('auth:sanctum');

// Group for routes that require authentication
Route::middleware('auth:sanctum','hasPermission')->group(function () {

    Route::get('profile', [ProfileController::class, 'show']);
    Route::post('logout', [LoginController::class, 'logout'])->name('api.logout');
    
});
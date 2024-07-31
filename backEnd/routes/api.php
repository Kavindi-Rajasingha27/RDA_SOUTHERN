<?php

use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\EmployeeController;
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

    // Employee CRUD routes
    Route::get('employees', [EmployeeController::class, 'index']); // Get all employees
    Route::post('employees', [EmployeeController::class, 'store']); // Create a new employee
    Route::get('employees/{employee}', [EmployeeController::class, 'show']); // Get a specific employee
    Route::put('employees/{employee}', [EmployeeController::class, 'update']); // Update a specific employee
    Route::delete('employees/{employee}', [EmployeeController::class, 'destroy']); // Delete a specific employee

    // Employee search route
    Route::get('employee/search', [EmployeeController::class, 'search']);// Search for employees

    // Dependent CRUD routes
    Route::post('employees/{employee}/dependents', [EmployeeController::class, 'storeDependent']);
    Route::put('employees/{employee}/dependents/{dependent}', [EmployeeController::class, 'updateDependent']);
    Route::delete('employees/{employee}/dependents/{dependent}', [EmployeeController::class, 'destroyDependent']);

    // Qualification CRUD routes
    Route::post('employees/{employee}/qualifications', [EmployeeController::class, 'storeQualification']);
    Route::put('employees/{employee}/qualifications/{qualification}', [EmployeeController::class, 'updateQualification']);
    Route::delete('employees/{employee}/qualifications/{qualification}', [EmployeeController::class, 'destroyQualification']);
    
});
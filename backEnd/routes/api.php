<?php

use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProfileController;

Route::post('login', [LoginController::class, 'login'])->name('api.login')
    ->withoutMiddleware('auth:sanctum');


Route::middleware('auth:sanctum','hasPermission')->group(function () {

    Route::get('profile', [ProfileController::class, 'show']);
    Route::post('logout', [LoginController::class, 'logout'])->name('api.logout');

    Route::get('employees', [EmployeeController::class, 'getAllEmployees']);
    Route::post('employees', [EmployeeController::class, 'createEmployee']);
    Route::get('employees/{employee}', [EmployeeController::class, 'getOneEmployee']);
    Route::put('employees/{employee}', [EmployeeController::class, 'updateEmployee']);
    Route::delete('employees/{employee}', [EmployeeController::class, 'deleteEmployee']);
    Route::get('employee/search', [EmployeeController::class, 'searchEmployees']);

    Route::post('employees/{employee}/dependents', [EmployeeController::class, 'storeDependent']);
    Route::put('employees/{employee}/dependents/{dependent}', [EmployeeController::class, 'updateDependent']);
    Route::delete('employees/{employee}/dependents/{dependent}', [EmployeeController::class, 'destroyDependent']);

    Route::post('employees/{employee}/qualifications', [EmployeeController::class, 'storeQualification']);
    Route::put('employees/{employee}/qualifications/{qualification}', [EmployeeController::class, 'updateQualification']);
    Route::delete('employees/{employee}/qualifications/{qualification}', [EmployeeController::class, 'destroyQualification']);
    
});
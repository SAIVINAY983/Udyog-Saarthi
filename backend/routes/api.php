<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\TrainingModuleController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\UserProgressController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user()->load('profile');
    });
    Route::get('/profile', function (Request $request) {
        return $request->user()->profile;
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Job Postings
    Route::apiResource('jobs', JobController::class);

    // Training Modules
    Route::apiResource('training', TrainingModuleController::class);

    // Applications
    Route::apiResource('applications', ApplicationController::class)->only(['index', 'store', 'update']);

    // User Progress
    Route::apiResource('progress', UserProgressController::class)->only(['index', 'store', 'update']);

    // Admin Routes
    Route::get('/admin/stats', [\App\Http\Controllers\AdminController::class, 'stats']);
    Route::get('/admin/users', [\App\Http\Controllers\AdminController::class, 'indexUsers']);
    Route::delete('/admin/users/{id}', [\App\Http\Controllers\AdminController::class, 'destroyUser']);
    Route::get('/admin/jobs', [\App\Http\Controllers\AdminController::class, 'indexJobs']);
    Route::get('/admin/modules', [\App\Http\Controllers\AdminController::class, 'indexModules']);
});

<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\TrainingModuleController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\UserProgressController;
use App\Http\Controllers\ResumeController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user()->load('profile');
    });
    Route::get('/talent', function (Request $request) {
        // Return only job seekers for talent discovery
        return \App\Models\User::where('role', 'user')->with('profile')->get();
    });
    Route::get('/profile', function (Request $request) {
        return $request->user()->profile;
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Job Postings
    Route::apiResource('jobs', JobController::class);

    // Training Modules
    Route::post('/training/upload', [TrainingModuleController::class, 'upload']);
    Route::apiResource('training', TrainingModuleController::class);

    // Applications
    Route::apiResource('applications', ApplicationController::class)->only(['index', 'store', 'update']);

    // User Progress
    Route::apiResource('progress', UserProgressController::class)->only(['index', 'store', 'update']);

    // Resume
    Route::get('/resume', [ResumeController::class, 'show']);
    // I will use POST for both create and update (upsert)
    Route::post('/resume', [ResumeController::class, 'store']);

    // Admin Routes
    Route::get('/admin/stats', [\App\Http\Controllers\AdminController::class, 'stats']);
    Route::get('/admin/users', [\App\Http\Controllers\AdminController::class, 'indexUsers']);
    Route::put('/admin/users/{id}', [\App\Http\Controllers\AdminController::class, 'updateUser']);
    Route::delete('/admin/users/{id}', [\App\Http\Controllers\AdminController::class, 'destroyUser']);
    Route::post('/admin/broadcast', [\App\Http\Controllers\AdminController::class, 'broadcastNotification']);
    Route::get('/admin/jobs', [\App\Http\Controllers\AdminController::class, 'indexJobs']);
    Route::get('/admin/modules', [\App\Http\Controllers\AdminController::class, 'indexModules']);
    Route::get('/admin/applications', [\App\Http\Controllers\AdminController::class, 'indexApplications']);


    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
    Route::put('/notifications/{notification}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead']);
});

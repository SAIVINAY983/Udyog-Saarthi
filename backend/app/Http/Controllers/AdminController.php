<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\JobPosting;
use App\Models\TrainingModule;
use App\Models\Application;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if ($request->user() && $request->user()->role === 'admin') {
                return $next($request);
            }
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        });
    }

    public function indexUsers()
    {
        return response()->json(User::with('profile')->get());
    }

    public function destroyUser($id)
    {
        if (auth()->id() == $id) {
            return response()->json(['message' => 'Cannot delete yourself.'], 400);
        }
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'User deleted successfully.']);
    }

    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_jobs' => JobPosting::count(),
            'total_modules' => TrainingModule::count(),
            'total_applications' => Application::count(),
        ]);
    }

    public function indexJobs()
    {
        return response()->json(JobPosting::with('employer')->latest()->get());
    }

    public function indexModules()
    {
        return response()->json(TrainingModule::with('trainer')->latest()->get());
    }
}

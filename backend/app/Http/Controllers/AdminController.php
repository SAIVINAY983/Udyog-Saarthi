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
        // Middleware should be handled in routes/api.php for Laravel 11 compatibility
        // or by implementing the HasMiddleware interface.
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
        // Basic counts
        $totalUsers = User::count();
        $totalJobs = JobPosting::count();
        $totalModules = TrainingModule::count();
        $totalApplications = Application::count();

        // Applications by Status
        $applicationsByStatus = Application::select('status', \DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        // User Roles Distribution
        $usersByRole = User::select('role', \DB::raw('count(*) as count'))
            ->groupBy('role')
            ->get();

        // Recent Registrations (Last 30 days)
        $recentRegistrations = User::select(\DB::raw('DATE(created_at) as date'), \DB::raw('count(*) as count'))
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get();

        // Jobs by Location
        $jobsByLocation = JobPosting::select('location', \DB::raw('count(*) as count'))
            ->groupBy('location')
            ->orderBy('count', 'DESC')
            ->limit(5)
            ->get();

        // Training Modules by Type
        $modulesByType = TrainingModule::select('module_type', \DB::raw('count(*) as count'))
            ->groupBy('module_type')
            ->get();

        return response()->json([
            'total_users' => $totalUsers,
            'total_jobs' => $totalJobs,
            'total_modules' => $totalModules,
            'total_applications' => $totalApplications,
            'applications_by_status' => $applicationsByStatus,
            'users_by_role' => $usersByRole,
            'recent_registrations' => $recentRegistrations,
            'jobs_by_location' => $jobsByLocation,
            'modules_by_type' => $modulesByType,
        ]);
    }

    public function indexApplications()
    {
        return response()->json(Application::with(['user', 'jobPosting.employer'])->latest()->get());
    }


    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'role' => 'required|string|in:admin,employer,trainer,user',
        ]);

        $user->update($validated);
        return response()->json($user);
    }

    public function broadcastNotification(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'message' => 'required|string',
            'type' => 'required|string|in:info,success,warning,error',
        ]);

        $users = User::all();
        foreach ($users as $user) {
            \App\Models\Notification::create([
                'user_id' => $user->id,
                'title' => '📢 ADMIN BROADCAST: ' . $validated['title'],
                'message' => $validated['message'],
                'type' => $validated['type']
            ]);
        }

        return response()->json(['message' => 'Broadcast sent to ' . $users->count() . ' users.']);
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

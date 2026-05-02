<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\JobPosting;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'employer') {
            // Get applications for jobs posted by this employer
            $applications = Application::whereHas('jobPosting', function ($query) use ($user) {
                $query->where('employer_id', $user->id);
            })->with(['user.profile', 'jobPosting'])->latest()->get();
        } else {
            // Get applications submitted by this job seeker
            $applications = Application::where('user_id', $user->id)
                ->with('jobPosting.employer')
                ->latest()
                ->get();
        }

        return response()->json($applications);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_posting_id' => 'required|exists:job_postings,id',
        ]);

        // Check if already applied
        $existing = Application::where('user_id', $request->user()->id)
            ->where('job_posting_id', $validated['job_posting_id'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already applied for this job.'], 400);
        }

        $application = Application::create([
            'job_posting_id' => $validated['job_posting_id'],
            'user_id' => $request->user()->id,
            'status' => 'applied',
        ]);

        return response()->json($application, 201);
    }

    public function update(Request $request, string $id)
    {
        $application = Application::findOrFail($id);
        $user = $request->user();

        // Only employer who posted the job can update the status
        $jobOwner = JobPosting::find($application->job_posting_id)->employer_id;
        if ($user->id !== $jobOwner) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:applied,interviewed,hired,rejected',
        ]);

        $application->update($validated);

        return response()->json($application);
    }
}

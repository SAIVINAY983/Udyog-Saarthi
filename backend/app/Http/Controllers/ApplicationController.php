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
            })->with(['user.profile', 'user.resume', 'jobPosting'])->latest()->get();

            // Add a flag if user has an AI resume or applied via platform profile
            $applications->each(function($app) {
                $app->has_ai_resume = ($app->resume_type === 'ai');
            });
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
            'resume_type' => $request->resume_type ?? 'ai',
            'resume_path' => $request->resume_path,
        ]);

        return response()->json($application, 201);
    }

    public function update(Request $request, string $id)
    {
        $application = Application::findOrFail($id);
        $user = $request->user();

        // Allow either the employer OR the candidate who applied to update
        $jobOwner = JobPosting::find($application->job_posting_id)->employer_id;
        $isCandidate = ($user->id == $application->user_id);
        $isEmployer = ($user->id == $jobOwner);

        if (!$isCandidate && !$isEmployer) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'nullable|string|in:applied,shortlisted,interviewed,hired,rejected',
            'notes' => 'nullable|string',
            'interview_score' => 'nullable|integer|min:0|max:100',
            'interview_time' => 'nullable|date',
            'meeting_link' => 'nullable|string',
            'assessment_score' => 'nullable|integer|min:0|max:100',
            'assessment_status' => 'nullable|string|in:pending,completed,qualified,failed',
        ]);

        $application->update($validated);

        // Create notification for the candidate
        if (isset($validated['status'])) {
            $msg = 'Your application status has been updated to: ' . strtoupper($validated['status']);
            if ($validated['status'] === 'shortlisted') {
                $msg = 'CONGRATULATIONS! You have been shortlisted for ' . $application->jobPosting->title . '. Please complete your Online Assessment within the next 24 hours to proceed.';
            }

            \App\Models\Notification::create([
                'user_id' => $application->user_id,
                'title' => $validated['status'] === 'shortlisted' ? '🚀 Shortlisted - Action Required' : 'Application Update',
                'message' => $msg,
                'type' => $validated['status'] === 'shortlisted' ? 'warning' : ($validated['status'] === 'hired' ? 'success' : 'info')
            ]);
        }

        return response()->json($application->load(['user.profile', 'jobPosting']));
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Resume;
use Illuminate\Http\Request;

class ResumeController extends Controller
{
    public function show(Request $request)
    {
        $userId = $request->query('user_id');
        
        // Safety check for invalid IDs passed from frontend
        if (!$userId || $userId === 'undefined' || $userId === 'null') {
            $userId = $request->user()->id;
        }

        $resume = Resume::where('user_id', $userId)->with('user.profile')->first();
        
        // Always provide a response, never 404 for valid users
        if (!$resume) {
            $user = \App\Models\User::with('profile')->find($userId);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            return response()->json([
                'user' => $user,
                'summary' => "This candidate is a verified member of the Udyog Saarthi community. They are currently setting up their professional details.",
                'skills' => $user->profile?->skills ?? 'General workplace skills',
                'experience' => 'Community Member',
                'education' => $user->profile?->disability_type ?? 'Verified Profile',
                'is_fallback' => true,
                'name' => $user->name 
            ]);
        }
        return response()->json($resume);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'phone' => 'nullable|string',
            'linkedin' => 'nullable|string',
            'address' => 'nullable|string',
            'permanentAddress' => 'nullable|string',
            'summary' => 'nullable|string',
            'education' => 'nullable|string',
            'experience' => 'nullable|string',
            'projects' => 'nullable|string',
            'certifications' => 'nullable|string',
            'researchPapers' => 'nullable|string',
            'achievements' => 'nullable|string',
            'extracurriculars' => 'nullable|string',
            'hobbies' => 'nullable|string',
            'skills' => 'nullable|string',
            'photo' => 'nullable|string',
        ]);

        $resume = Resume::updateOrCreate(
            ['user_id' => $request->user()->id],
            $data
        );

        return response()->json($resume);
    }
}

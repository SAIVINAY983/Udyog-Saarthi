<?php

namespace App\Http\Controllers;

use App\Models\UserProgress;
use Illuminate\Http\Request;

class UserProgressController extends Controller
{
    public function index(Request $request)
    {
        $progress = UserProgress::where('user_id', $request->user()->id)
            ->with('trainingModule')
            ->latest()
            ->get();

        return response()->json($progress);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'training_module_id' => 'required|exists:training_modules,id',
        ]);

        $existing = UserProgress::where('user_id', $request->user()->id)
            ->where('training_module_id', $validated['training_module_id'])
            ->first();

        if ($existing) {
            return response()->json($existing);
        }

        $progress = UserProgress::create([
            'user_id' => $request->user()->id,
            'training_module_id' => $validated['training_module_id'],
            'status' => 'in_progress',
        ]);

        return response()->json($progress, 201);
    }

    public function update(Request $request, string $id)
    {
        $progress = UserProgress::findOrFail($id);

        if ($progress->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:in_progress,completed',
        ]);

        $progress->update($validated);

        // Optionally, update the user's readiness score in Profile here when a module is completed
        if ($validated['status'] === 'completed') {
            $profile = $request->user()->profile;
            if ($profile) {
                // simple increment logic for readiness score
                $profile->readiness_score = min(100, $profile->readiness_score + 10);
                $profile->save();
            }
        }

        return response()->json($progress);
    }
}

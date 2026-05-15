<?php

namespace App\Http\Controllers;

use App\Models\TrainingModule;
use Illuminate\Http\Request;

class TrainingModuleController extends Controller
{
    public function index()
    {
        return response()->json(TrainingModule::orderBy('order_index')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content_url' => 'nullable|string',
            'module_type' => 'nullable|string',
            'order_index' => 'nullable|integer',
            'questions' => 'nullable|array',
        ]);

        // If file is uploaded
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('training', 'public');
            $validated['content_url'] = '/storage/' . $path;
        }

        $module = TrainingModule::create(array_merge($validated, [
            'trainer_id' => $request->user()->id,
        ]));

        return response()->json($module, 201);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx,ppt,pptx,zip|max:10240',
        ]);

        $path = $request->file('file')->store('training', 'public');
        return response()->json(['path' => '/storage/' . $path]);
    }

    public function show(string $training)
    {
        $module = TrainingModule::findOrFail($training);
        return response()->json($module);
    }

    public function update(Request $request, string $training)
    {
        $module = TrainingModule::findOrFail($training);
        if ($request->user()->id !== $module->trainer_id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content_url' => 'nullable|string',
            'module_type' => 'nullable|string',
            'order_index' => 'nullable|integer',
            'questions' => 'nullable|array',
        ]);

        $module->update($validated);
        return response()->json($module);
    }

    public function destroy($training)
    {
        $module = TrainingModule::find($training);
        if (!$module) {
            return response()->json(['message' => 'Module already deleted or not found.'], 404);
        }

        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Not authenticated.'], 401);
        }

        if ($user->id !== $module->trainer_id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only the trainer or admin can delete this.'], 403);
        }

        $module->delete();
        return response()->json(['message' => 'Deleted successfully.'], 200);
    }
}

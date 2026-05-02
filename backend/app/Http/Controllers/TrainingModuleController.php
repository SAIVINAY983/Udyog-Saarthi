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
        ]);

        $module = TrainingModule::create(array_merge($validated, [
            'trainer_id' => $request->user()->id,
        ]));

        return response()->json($module, 201);
    }

    public function show(string $id)
    {
        $module = TrainingModule::findOrFail($id);
        return response()->json($module);
    }

    public function update(Request $request, string $id)
    {
        $module = TrainingModule::findOrFail($id);
        if ($request->user()->id !== $module->trainer_id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $module->update($request->all());
        return response()->json($module);
    }

    public function destroy(string $id)
    {
        $module = TrainingModule::findOrFail($id);
        if ($request->user()->id !== $module->trainer_id && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $module->delete();
        return response()->json(null, 204);
    }
}

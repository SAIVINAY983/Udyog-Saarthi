<?php

namespace App\Http\Controllers;

use App\Models\JobPosting;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = JobPosting::query();

        if ($request->has(['lat', 'lng'])) {
            $lat = $request->lat;
            $lng = $request->lng;
            $radius = 50; // Radius in KM

            // Simple square bounding box for filtering (rough approximation)
            // 1 degree lat is approx 111km
            $latRange = $radius / 111;
            $lngRange = $radius / (111 * cos(deg2rad($lat)));

            $query->whereBetween('latitude', [$lat - $latRange, $lat + $latRange])
                  ->whereBetween('longitude', [$lng - $lngRange, $lng + $lngRange]);
        }

        return $query->with('employer')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'nullable|string',
            'job_type' => 'nullable|string',
            'reservation_category' => 'nullable|string',
            'skills_required' => 'nullable|string',
        ]);

        $job = JobPosting::create(array_merge($validated, [
            'employer_id' => $request->user()->id,
        ]));

        return response()->json($job, 201);
    }

    public function show(string $id)
    {
        $job = JobPosting::findOrFail($id);
        return response()->json($job);
    }

    public function update(Request $request, string $id)
    {
        $job = JobPosting::findOrFail($id);
        if ($request->user()->id !== $job->employer_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $job->update($request->all());
        return response()->json($job);
    }

    public function destroy(string $id)
    {
        $job = JobPosting::findOrFail($id);
        if ($request->user()->id !== $job->employer_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $job->delete();
        return response()->json(null, 204);
    }
}

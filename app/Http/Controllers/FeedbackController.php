<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFeedbackRequest;
use App\Http\Requests\UpdateFeedbackRequest;
use App\Models\Feedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 10);
        $feedback = Feedback::with('user')
            ->latest()
            ->paginate($perPage);
    
        return response()->json($feedback, 200);
    }
    
    public function store(StoreFeedbackRequest $request): JsonResponse
    {
        $feedback = Feedback::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'category' => $request->category,
            'description' => $request->description,
        ]);

        return response()->json($feedback->load('user'), 201);
    }

    public function show(Feedback $feedback): JsonResponse
    {
        return response()->json($feedback->load(['user','assignee']), 200);
    }
    
    public function update(UpdateFeedbackRequest $request, Feedback $feedback): JsonResponse
    {
        $feedback->update($request->validated());
        return response()->json($feedback->load(['user','assignee']), 200);
    }
        
    public function destroy(Feedback $feedback): JsonResponse
    {
        if ($feedback->user_id !== auth()->id()) abort(403);
        $feedback->delete();
        return response()->json(null, 204);
    }
}

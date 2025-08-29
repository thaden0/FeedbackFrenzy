<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\Comment;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = max(1, min((int) $request->integer('per_page', 10), 100));    
        $query = Comment::with(['user','feedback'])->latest();
    
        if ($request->filled('id')) {
            $ids = collect(explode(',', (string) $request->query('id')))
                   ->filter()->map('intval')->all();
            $query->whereIn('id', $ids);
        }
        if ($request->filled('feedback_id')) {
            $query->where('feedback_id', (int) $request->query('feedback_id'));
        }
            
        $comments = $query->paginate($perPage);

        return response()->json($comments, 200);
    }
            
    public function store(StoreCommentRequest $request, NotificationService $notifier): JsonResponse
    {
        $comment = Comment::create([
            'user_id'     => auth()->id(),
            'feedback_id' => $request->feedback_id,
            'comment'     => $request->comment,
        ]);

        $comment->load(['user','feedback']);
        $notifier->notifyMentions($comment);

        return response()->json($comment, 201);
    }

    public function show(Comment $comment): JsonResponse
    {
        return response()->json($comment->load(['user', 'feedback']), 200);
    }

    public function update(UpdateCommentRequest $request, Comment $comment): JsonResponse
    {
        if (auth()->id() !== $comment->user_id) {
            abort(403, 'Unauthorized');
        }

        $comment->update($request->validated());
        return response()->json($comment->load(['user', 'feedback']), 200);
    }

    public function destroy(Comment $comment): JsonResponse
    {
        $ownerId    = $comment->user_id;
        $feedbackOw = $comment->feedback()->value('user_id');
    
        if (!in_array(auth()->id(), [$ownerId, $feedbackOw], true)) {
            abort(403, 'Unauthorized');
        }
    
        $comment->delete();
        return response()->json(null, 204);
    }
} 
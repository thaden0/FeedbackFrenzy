<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNotificationRequest;
use App\Http\Requests\UpdateNotificationRequest;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $per = (int) $request->integer('per_page', 10);
        $notifications = Notification::where('user_id', auth()->id())
            ->latest()
            ->paginate($per);
        
        return response()->json($notifications, 200);
    }

    public function store(StoreNotificationRequest $request): JsonResponse
    {
        $notification = Notification::create([
            'user_id' => auth()->id(),
            'seen' => $request->get('seen', false),
            'description' => $request->description,
            'link' => $request->link,
        ]);

        return response()->json($notification->load('user'), 201);
    }

    public function show(Notification $notification): JsonResponse
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        return response()->json($notification->load('user'), 200);
    }

    public function update(UpdateNotificationRequest $request, Notification $notification): JsonResponse
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $notification->update($request->validated());
        return response()->json($notification->load('user'), 200);
    }

    public function destroy(Notification $notification): JsonResponse
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }

        $notification->delete();
        return response()->json(null, 204);
    }
} 
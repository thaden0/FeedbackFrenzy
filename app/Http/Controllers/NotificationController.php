<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function poll(Request $req): JsonResponse
    {
        $userId = (int) auth()->id();
        $limit  = max(1, min((int) $req->integer('limit', 20), 100));
    
        $rows = DB::transaction(function () use ($userId, $limit) {
            $rows = Notification::where('user_id', $userId)
                ->where('seen', false)
                ->orderBy('id')
                ->limit($limit)
                ->get(['id','description','link','seen','created_at']);
    
            if ($rows->isEmpty()) {
                return $rows;
            }    
            Notification::whereIn('id', $rows->pluck('id'))->update(['seen' => true]);
    
            $rows->transform(function ($n) { $n->seen = true; return $n; });
    
            return $rows->sortByDesc('id')->values();
        });
    
        return response()->json($rows, 200);
    }

    public function unseenCount(): JsonResponse
    {
        $count = Notification::where('user_id', auth()->id())
            ->where('seen', false)
            ->count();

        return response()->json(['count' => $count], 200);
    }
}

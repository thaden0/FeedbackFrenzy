<?php

namespace App\Services;

use App\Models\Comment;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Str;

class NotificationService
{
    private const MENTION_RX = '/@([A-Za-z0-9._-]{2,50})/';

    public function notifyMentions(Comment $comment): void
    {
        preg_match_all(self::MENTION_RX, $comment->comment, $m);
        $handles = collect($m[1] ?? [])->map(fn($h) => strtolower($h))->unique()->values();
        if ($handles->isEmpty()) return;

        $authorId = (int) $comment->user_id;
        $authorName = optional($comment->user)->name ?? 'Someone';
        $feedbackId = (int) $comment->feedback_id;

        foreach ($handles as $h) {
            $user = User::whereRaw('LOWER(username) = ?', [$h])->first();
            if (!$user || $user->id === $authorId) continue;

            Notification::create([
                'user_id'     => $user->id,
                'seen'        => false,
                'description' => "{$authorName} mentioned you: " . Str::limit($comment->comment, 80),
                'link'        => "/dashboard?selected={$feedbackId}",
            ]);
        }
    }
}

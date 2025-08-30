<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Feedback;
use App\Models\Comment;
use App\Models\Notification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 10 users
        /** @var Collection<int,User> $users */
        $users = User::factory()->count(10)->create();

        // 20 feedback tickets
        /** @var Collection<int,Feedback> $tickets */
        $tickets = Feedback::factory()
            ->count(20)
            ->state(function () use ($users) {
                $reporter = $users->random();
                $assignee = $users->random();
                return [
                    'user_id'     => $reporter->id,
                    'assignee_id' => $assignee->id,
                ];
            })
            ->create();

        // comments: 2–6 per ticket
        $tickets->each(function (Feedback $f) use ($users) {
            Comment::factory()
                ->count(rand(2,6))
                ->state(function () use ($users, $f) {
                    return [
                        'user_id'     => $users->random()->id,
                        'feedback_id' => $f->id,
                    ];
                })
                ->create();
        });

        // notifications: 3–8 per user
        $users->each(function (User $u) {
            Notification::factory()
                ->count(rand(3,8))
                ->state(['user_id' => $u->id])
                ->create();
        });

        // extra: cross-notify comment mentions
        $tickets->each(function (Feedback $f) {
            // notify reporter and assignee about ticket creation if not the same
            collect([$f->user_id, $f->assignee_id])
                ->unique()
                ->each(function ($uid) use ($f) {
                    Notification::create([
                        'user_id'     => $uid,
                        'seen'        => false,
                        'description' => "Feedback #{$f->id}: \"{$f->title}\" created.",
                        'link'        => url("/feedback/{$f->id}"),
                    ]);
                });
        });
    }
}

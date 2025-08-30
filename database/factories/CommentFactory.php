<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Feedback;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition(): array
    {
        return [
            'user_id'     => User::inRandomOrder()->value('id') ?? User::factory(),
            'feedback_id' => Feedback::inRandomOrder()->value('id') ?? Feedback::factory(),
            'comment'     => fake()->paragraphs(rand(1,2), true),
            'created_at'  => fake()->dateTimeBetween('-60 days', 'now'),
            'updated_at'  => now(),
        ];
    }
}

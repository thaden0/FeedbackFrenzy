<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFactory extends Factory
{
    public function definition(): array
    {
        $categories = ['feature','bug','improvement','ui','performance','security','docs','other'];
        $statuses   = ['new','triage','in_progress','review','blocked','completed','rejected'];

        return [
            'user_id'     => User::inRandomOrder()->value('id') ?? User::factory(),
            'title'       => ucfirst(fake()->words(rand(3,7), true)),
            'category'    => fake()->randomElement($categories),
            'description' => fake()->paragraphs(rand(1,3), true),
            'status'      => fake()->randomElement($statuses),
            'assignee_id' => User::inRandomOrder()->value('id') ?? User::factory(),
            'created_at'  => fake()->dateTimeBetween('-90 days', 'now'),
            'updated_at'  => now(),
        ];
    }

    public function feature(): static     { return $this->state(fn () => ['category' => 'feature']); }
    public function bug(): static         { return $this->state(fn () => ['category' => 'bug']); }
    public function improvement(): static { return $this->state(fn () => ['category' => 'improvement']); }

    public function inProgress(): static { return $this->state(fn () => ['status' => 'in_progress']); }
    public function completed(): static  { return $this->state(fn () => ['status' => 'completed']); }
    public function rejected(): static   { return $this->state(fn () => ['status' => 'rejected']); }
}

<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3, 6),
            'category' => fake()->randomElement(['feature', 'bug', 'improvement', 'other']),
            'description' => fake()->paragraphs(2, true),
            'status' => 'new',
            'assignee_id' => null,
        ];
    }

    public function feature(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'feature',
        ]);
    }

    public function bug(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'bug',
        ]);
    }

    public function improvement(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'improvement',
        ]);
    }

    /**
     * Set the feedback status to in progress
     */
    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'in_progress',
        ]);
    }

    /**
     * Set the feedback status to completed
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }

    /**
     * Set the feedback status to rejected
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
        ]);
    }
} 
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
} 
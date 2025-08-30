<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition(): array
    {
        return [
            'user_id'     => User::inRandomOrder()->value('id') ?? User::factory(),
            'seen'        => fake()->boolean(40),
            'description' => fake()->sentence(rand(6,12)),
            'link'        => fake()->url(), // never null
            'created_at'  => fake()->dateTimeBetween('-45 days', 'now'),
            'updated_at'  => now(),
        ];
    }
}

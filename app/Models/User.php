<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function feedback(): HasMany
    {
        return $this->hasMany(\App\Models\Feedback::class);
    }

    /**
     * Get the feedback assigned to this user
     */
    public function assignedFeedback(): HasMany
    {
        return $this->hasMany(\App\Models\Feedback::class, 'assignee_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(\App\Models\Comment::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(\App\Models\Notification::class);
    }

    protected static function booted(): void
    {
        static::creating(function ($user) {
            if (blank($user->username)) {
                $base = Str::slug((string)$user->name, '_') ?: 'user';
                $h = $base; $i = 1;
                while (static::where('username',$h)->exists()) $h = $base.$i++;
                $user->username = strtolower($h);
            }
        });
    }
    
}

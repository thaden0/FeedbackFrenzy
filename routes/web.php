<?php

use App\Http\Controllers\{
    ProfileController, UserController, FeedbackController, CommentController
};
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Welcome', [
    'canLogin' => Route::has('login'),
    'canRegister' => Route::has('register'),
    'laravelVersion' => Application::VERSION,
    'phpVersion' => PHP_VERSION,
]));

Route::get('/dashboard', fn () => Inertia::render('Dashboard'))
    ->middleware(['auth','verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/users', [UserController::class, 'index']);
    Route::apiResource('feedback', FeedbackController::class)->middleware('verified');
    Route::apiResource('comments', CommentController::class)->only(['index','store','show','update','destroy']);
    Route::get('/notifications/unseen-count', [\App\Http\Controllers\NotificationController::class, 'unseenCount']);
    Route::post('/notifications/poll', [\App\Http\Controllers\NotificationController::class, 'poll']);
});

require __DIR__.'/auth.php';

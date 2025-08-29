<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::middleware('auth')->get('/users', [\App\Http\Controllers\UserController::class, 'index']);
    Route::middleware(['verified'])->apiResource('feedback', \App\Http\Controllers\FeedbackController::class);
    Route::middleware(['auth'])->apiResource('comments', \App\Http\Controllers\CommentController::class);
    Route::middleware(['auth'])->apiResource('notifications', \App\Http\Controllers\NotificationController::class);
});

require __DIR__.'/auth.php';

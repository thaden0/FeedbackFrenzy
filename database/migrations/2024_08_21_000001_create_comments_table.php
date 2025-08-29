<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();

            // Define columns first, then FKs (more reliable on SQLite)
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('feedback_id');

            $table->text('comment');
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade');

            $table->foreign('feedback_id')
                ->references('id')->on('feedback') // singular
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};

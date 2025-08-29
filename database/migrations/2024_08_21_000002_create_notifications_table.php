<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->boolean('seen')->default(false);
            $table->string('description', 255);
            $table->string('link', 255);
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('seen');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
}; 
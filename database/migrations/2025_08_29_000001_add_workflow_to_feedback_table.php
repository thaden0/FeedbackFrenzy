<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('feedback', function (Blueprint $table) {
            $table->string('status', 30)->default('new')->after('description');
            $table->foreignId('assignee_id')->nullable()->after('status')->constrained('users')->nullOnDelete();
            
            $table->index('status');
            $table->index('assignee_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('feedback', function (Blueprint $table) {
            $table->dropForeign(['assignee_id']);
            $table->dropIndex(['status']);
            $table->dropIndex(['assignee_id']);
            $table->dropColumn(['status', 'assignee_id']);
        });
    }
}; 
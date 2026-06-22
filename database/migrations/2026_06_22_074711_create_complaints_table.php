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
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            // Connects the ticket directly to the user record
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->string('subject');
            $table->string('category'); // e.g., 'System Error', 'Other', etc.
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->text('description');

            // Optional: Tracking field for the administration side
            $table->enum('status', ['open', 'in-progress', 'resolved'])->default('open');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};

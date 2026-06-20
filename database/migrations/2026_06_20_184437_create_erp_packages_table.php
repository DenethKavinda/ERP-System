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
        Schema::create('erp_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 12, 2);
            $table->text('suitable_for')->nullable(); // Stored as comma-separated values
            $table->text('features')->nullable();     // Stored as comma-separated values
            $table->text('benefits')->nullable();     // Stored as comma-separated values
            $table->string('rating')->default('5.0');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('erp_packages');
    }
};

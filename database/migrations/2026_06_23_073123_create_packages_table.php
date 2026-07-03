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
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            // Connect packages to a specific parent cart box
            $table->foreignId('package_cart_id')->constrained('package_carts')->onDelete('cascade');

            $table->string('youtube_link')->nullable();
            $table->string('main_topic');
            $table->text('small_description')->nullable();
            $table->string('package_name');
            $table->decimal('price', 15, 2); // Handles LKR Currency values with precision
            $table->string('suitable_business');
            $table->text('core_features');
            $table->text('benefits');
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};

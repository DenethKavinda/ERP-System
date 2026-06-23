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
        Schema::create('package_carts', function (Blueprint $table) {
            $table->id();
            $table->string('cart_name');
            $table->string('button_name');
            $table->text('description')->nullable();
            $table->string('color_class')->default('from-blue-500 to-indigo-600'); // Holds tailwind dropdown gradient configurations
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_carts');
    }
};

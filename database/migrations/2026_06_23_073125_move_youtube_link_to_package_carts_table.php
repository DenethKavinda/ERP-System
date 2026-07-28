<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Remove from packages table
        Schema::table('packages', function (Blueprint $table) {
            if (Schema::hasColumn('packages', 'youtube_link')) {
                $table->dropColumn('youtube_link');
            }
        });

        // 2. Add to parent package_carts table
        Schema::table('package_carts', function (Blueprint $table) {
            $table->string('youtube_link')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('package_carts', function (Blueprint $table) {
            $table->dropColumn('youtube_link');
        });

        Schema::table('packages', function (Blueprint $table) {
            $table->string('youtube_link')->nullable();
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('success_stories', function (Blueprint $table) {
            if (!Schema::hasColumn('success_stories', 'is_approved')) {
                $table->boolean('is_approved')->default(false)->after('rating');
            }
        });
    }

    public function down(): void
    {
        Schema::table('success_stories', function (Blueprint $table) {
            if (Schema::hasColumn('success_stories', 'is_approved')) {
                $table->dropColumn('is_approved');
            }
        });
    }
};

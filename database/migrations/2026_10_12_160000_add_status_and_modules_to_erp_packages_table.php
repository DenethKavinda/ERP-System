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
        Schema::table('erp_packages', function (Blueprint $table) {
            $table->string('status')->default('active')->after('code'); // active, draft, archived
            $table->json('modules')->nullable()->after('benefits');    // Array of machine-readable module flags
            $table->integer('sort_order')->default(0)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('erp_packages', function (Blueprint $table) {
            $table->dropColumn(['status', 'modules', 'sort_order']);
        });
    }
};

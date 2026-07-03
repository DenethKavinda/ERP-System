<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->decimal('base_price', 10, 2)->after('package_name')->default(0.00);
            $table->decimal('addons_total', 10, 2)->after('base_price')->default(0.00);
            $table->text('addons_manifest')->after('addons_total')->nullable(); // Stores detailed JSON snapshots
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn(['base_price', 'addons_total', 'addons_manifest']);
        });
    }
};

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
            $table->string('code')->nullable()->after('name');
            $table->integer('max_branches')->default(1)->after('price');
            $table->integer('max_warehouses')->default(1)->after('max_branches');
            $table->integer('max_users')->default(2)->after('max_warehouses');
            $table->integer('max_products')->default(-1)->after('max_users');
            $table->integer('max_monthly_bills')->default(-1)->after('max_products');
            $table->boolean('is_popular')->default(false)->after('max_monthly_bills');
            $table->integer('trial_days')->default(0)->after('is_popular');
            $table->string('inherited_from')->nullable()->after('trial_days');
            $table->string('badge_text')->nullable()->after('inherited_from');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('erp_packages', function (Blueprint $table) {
            $table->dropColumn([
                'code',
                'max_branches',
                'max_warehouses',
                'max_users',
                'max_products',
                'max_monthly_bills',
                'is_popular',
                'trial_days',
                'inherited_from',
                'badge_text',
            ]);
        });
    }
};

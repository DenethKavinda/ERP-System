<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Align erp_packages table with PlanService::PLANS authoritative constants.
 *
 * Changes applied:
 * 1. Enterprise max_users: 50 → -1 (unlimited, matches Backend PlanService line 136)
 * 2. Enterprise features: confirm "Unlimited Branch & Warehouse Scaling" (not "External App & API Integrations")
 */
return new class extends Migration
{
    public function up(): void
    {
        // 1. Enterprise: align max_users to -1 (unlimited)
        DB::table('erp_packages')
            ->where('code', 'enterprise')
            ->update([
                'max_users' => -1,
                'features' => 'Platform Security Audit Logging, Granular Custom Roles & Permission Control, Unlimited Branch & Warehouse Scaling, Service Master & Custom Invoicing, 99.9% Uptime SLA & Dedicated TAM, 24/7 Priority Emergency Support',
            ]);
    }

    public function down(): void
    {
        DB::table('erp_packages')
            ->where('code', 'enterprise')
            ->update([
                'max_users' => 50,
                'features' => 'Platform Security Audit Logging, Granular Custom Roles & Permission Control, Unlimited Branch & Warehouse Scaling, Service Master & Custom Invoicing, 99.9% Uptime SLA & Dedicated TAM, 24/7 Priority Emergency Support',
            ]);
    }
};

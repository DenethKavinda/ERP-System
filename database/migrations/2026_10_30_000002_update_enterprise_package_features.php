<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('erp_packages')
            ->where('code', 'enterprise')
            ->orWhere('name', 'ERP Enterprise Scaled')
            ->update([
                'features' => 'Platform Security Audit Logging, Granular Custom Roles & Permission Control, Unlimited Branch & Warehouse Scaling, Service Master & Custom Invoicing, 99.9% Uptime SLA & Dedicated TAM, 24/7 Priority Emergency Support',
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op rollback
    }
};

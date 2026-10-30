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
        $docs = [
            'Nexus ERP Quickstart & Branch Setup Guide' => [
                'file_url' => '/docs/nexus-erp-quickstart.pdf',
                'type' => 'pdf',
                'category' => 'Deployment Guide',
            ],
            'POS Cashier Shift Control & Daily Reconciliation' => [
                'file_url' => '/docs/pos-shift-balancing.pdf',
                'type' => 'pdf',
                'category' => 'Operations',
            ],
            'Thermal POS Printer (80mm) & Windows Setup Manual' => [
                'file_url' => '/docs/thermal-printer-guide.pdf',
                'type' => 'pdf',
                'category' => 'Hardware Setup',
            ],
            'Barcode & QR Scanner Pairing with Nexus Inventory' => [
                'file_url' => '/docs/scanner-guide.pdf',
                'type' => 'pdf',
                'category' => 'Hardware Setup',
            ],
            'Bulk Products & Customer Credit CSV Migration Guide' => [
                'file_url' => '/docs/csv-migration.pdf',
                'type' => 'pdf',
                'category' => 'Data Migration',
            ],
            'Sri Lanka Statutory Payroll Compliance Checklist' => [
                'file_url' => '/docs/statutory-payroll.pdf',
                'type' => 'pdf',
                'category' => 'Compliance',
            ],
        ];

        foreach ($docs as $title => $data) {
            DB::table('knowledge_docs')
                ->where('title', $title)
                ->update($data);
        }

        // Remove any obsolete legacy placeholder documentation records
        DB::table('knowledge_docs')
            ->where('file_url', 'like', '%example.com%')
            ->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op rollback
    }
};

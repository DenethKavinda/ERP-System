<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\DashboardCard;
use App\Models\ErpPackage;
use App\Models\KnowledgeDoc;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'business_name' => 'Nexus Global Technologies',
                'nic' => '199912345678',
                'address' => 'Colombo, Sri Lanka',
                'mobile_number' => '0771234567',
                'role' => 'admin',
                'password' => bcrypt('password'),
            ]
        );

        $client = User::firstOrCreate(
            ['email' => 'client@example.com'],
            [
                'name' => 'Dinith Kavinda',
                'business_name' => 'Apex Retail Solutions Ltd',
                'nic' => '199512345679',
                'address' => 'Kandy, Sri Lanka',
                'mobile_number' => '0719876543',
                'role' => 'user',
                'password' => bcrypt('password'),
            ]
        );

        // 2. Dashboard Cards (Central Operations Framework)
        $cards = [
            [
                'name' => 'ERP Architecture Packages',
                'path' => '/ERP',
                'button_text' => 'Explore Packages',
                'description' => 'Deploy modular, scalable Enterprise Resource Planning packages tailored for your specific industry vertical.',
                'accent_color' => 'from-blue-600 to-indigo-600',
            ],
            [
                'name' => 'Compliance & Grievance Console',
                'path' => '/complaints',
                'button_text' => 'Open Portal',
                'description' => 'Submit and track enterprise compliance issues, service tickets, and resolution documentation in real-time.',
                'accent_color' => 'from-amber-500 to-orange-600',
            ],
            [
                'name' => 'Knowledge Center & Docs',
                'path' => '/knowledge-center',
                'button_text' => 'Access Docs',
                'description' => 'Explore API technical documentation, architecture blueprints, guides, and integration specifications.',
                'accent_color' => 'from-purple-600 to-pink-600',
            ],
            [
                'name' => 'Transactional Ledger',
                'path' => '/ledger',
                'button_text' => 'View Ledger',
                'description' => 'Access settlement logs, download signed tax invoices, and monitor active recurring subscription licenses.',
                'accent_color' => 'from-cyan-500 to-blue-600',
        ];

        foreach ($cards as $card) {
            DashboardCard::firstOrCreate(['name' => $card['name']], $card);
        }

        // 3. ERP Packages (Storefront `/ERP`)
        $erpPackages = [
            [
                'name' => 'ERP Free Starter',
                'price' => 0.00,
                'suitable_for' => 'Startups, Solo Founders & Evaluation',
                'features' => 'Fast POS Billing & Barcode Support, Thermal (80mm) & A4 Invoices, Cash & Card Split Payments, Real-Time Live Stock View, End-of-Day Sales Report',
                'benefits' => 'Free 30-Day Evaluation, Zero credit card required, Hardware compatibility testing',
                'rating' => '4.7',
                'youtube_id' => 'dQw4w9WgXcQ',
            ],
            [
                'name' => 'ERP Basic Essentials',
                'price' => 45000.00,
                'suitable_for' => 'Single Retail Shops, Boutiques & Pharmacies',
                'features' => 'High-Speed POS & Multi-Price Batches, Cashier Shift Control & Float Count, Dual-Location Showroom/Storeroom Stock, Purchases & Supplier GRN Tracking, Customer Credit Ledger & Return Bills, Single-Store Bin Card (Theft Audit), Daily Gross Profit on Sales Report',
                'benefits' => 'Single-Branch Powerhouse, Cashier Shift Reconciliation, Real-Time Gross Profit Analytics',
                'rating' => '4.8',
                'youtube_id' => 'dQw4w9WgXcQ',
            ],
            [
                'name' => 'ERP Professional Growth',
                'price' => 95000.00,
                'suitable_for' => 'Multi-Branch Retailers, Wholesalers & Distributors',
                'features' => 'Inter-Branch Stock Transfers & Dispatch, Centralized Price Control & Batch Markups, Manager Real-Time Approval Requests, Financial Summary & Profit Tracking, Expense & Bank Account Management, Multi-Branch Net Profit & Loss Reports, Granular Per-Module RBAC Permissions, Phone & WhatsApp Priority Support',
                'benefits' => 'Multi-Branch Sync, Approval Override Gates, Complete Financial Reports',
                'rating' => '4.9',
                'youtube_id' => 'dQw4w9WgXcQ',
            ],
            [
                'name' => 'Enterprise Custom Core',
                'price' => 195000.00,
                'suitable_for' => 'Department Chains, Large Wholesalers & Manufacturers',
                'features' => 'Platform Security Audit Logging, Granular Custom Roles & Permission Control, External App & API Integrations, Service Master & Custom Invoicing, 99.9% Uptime SLA & Dedicated TAM, 24/7 Priority Emergency Support',
                'benefits' => 'Dedicated Account Manager, 99.9% Uptime SLA, Unlimited Scaling & Priority Support',
                'rating' => '5.0',
                'youtube_id' => 'dQw4w9WgXcQ',
            ],
        ];

        foreach ($erpPackages as $pkg) {
            ErpPackage::updateOrCreate(['name' => $pkg['name']], $pkg);
        }

        // 5. Services & Add-ons Marketplace — Removed (no real purchasable services exist in the ERP system)

        // 6. Knowledge Docs (`/knowledge-center`)
        $docs = [
            [
                'slug' => 'nexus-erp-quickstart-branch-setup-guide',
                'title' => 'Nexus ERP Quickstart & Branch Setup Guide',
                'category' => 'Deployment Guide',
                'type' => 'pdf',
                'description' => 'Step-by-step walkthrough covering initial branch configuration, user roles, warehouse bins, and company branding settings.',
                'file_url' => 'https://example.com/docs/nexus-erp-quickstart.pdf',
            ],
            [
                'slug' => 'pos-cashier-shift-control-reconciliation',
                'title' => 'POS Cashier Shift Control & Daily Reconciliation',
                'category' => 'Operations',
                'type' => 'pdf',
                'description' => 'Guide on cashier opening floats, cash/card split payments, shift handovers, and blind end-of-day sales balancing.',
                'file_url' => 'https://example.com/docs/pos-shift-balancing.pdf',
            ],
            [
                'slug' => 'thermal-pos-printer-80mm-setup-manual',
                'title' => 'Thermal POS Printer (80mm) & Windows Setup Manual',
                'category' => 'Hardware Setup',
                'type' => 'pdf',
                'description' => 'ESC/POS commands, driver installation, page margins, and automatic cash drawer kick-out configuration.',
                'file_url' => 'https://example.com/docs/thermal-printer-guide.pdf',
            ],
            [
                'slug' => 'barcode-qr-scanner-pairing-nexus-inventory',
                'title' => 'Barcode & QR Scanner Pairing with Nexus Inventory',
                'category' => 'Hardware Setup',
                'type' => 'link',
                'description' => 'Configuring auto-enter suffixes, UPC/EAN format reading, and batch scanning for rapid inventory stocktaking.',
                'file_url' => 'https://example.com/docs/scanner-guide.pdf',
            ],
            [
                'slug' => 'bulk-products-customer-credit-csv-migration',
                'title' => 'Bulk Products & Customer Credit CSV Migration Guide',
                'category' => 'Data Migration',
                'type' => 'pdf',
                'description' => 'Excel & CSV spreadsheet templates for importing SKUs, cost prices, selling tiers, and customer credit ledgers.',
                'file_url' => 'https://example.com/docs/csv-migration.pdf',
            ],
            [
                'slug' => 'sri-lanka-statutory-payroll-compliance-checklist',
                'title' => 'Sri Lanka Statutory Payroll Compliance Checklist',
                'category' => 'Compliance',
                'type' => 'pdf',
                'description' => 'Reference tables and rules for EPF (12% + 8%), ETF (3%), and APIT withholding tax deductions with salary slips.',
                'file_url' => 'https://example.com/docs/statutory-payroll.pdf',
            ],
        ];

        foreach ($docs as $doc) {
            KnowledgeDoc::updateOrCreate(['title' => $doc['title']], $doc);
        }
    }
}

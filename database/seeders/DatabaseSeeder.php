<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\DashboardCard;
use App\Models\PackageCart;
use App\Models\Package;
use App\Models\Service;
use App\Models\ErpPackage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin Account
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'System Admin',
                'nic' => '111111111V',
                'address' => 'Head Office, Colombo',
                'mobile_number' => '0770000000',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // 2. Standard User Account
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'nic' => '222222222V',
                'address' => 'Sample Street, Kandy',
                'mobile_number' => '0771111111',
                'password' => Hash::make('password'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );

        // 3. Central Operations Framework Cards
        DashboardCard::firstOrCreate(
            ['name' => 'Inventory & POS Control'],
            [
                'path' => '/ERP',
                'button_text' => 'Launch Workspace',
                'description' => 'Manage stock, product catalogs, point of sale transactions, and supplier orders in real time.',
                'accent_color' => 'from-blue-500 to-indigo-600',
            ]
        );

        DashboardCard::firstOrCreate(
            ['name' => 'Financial Ledger & Invoices'],
            [
                'path' => '/ledger',
                'button_text' => 'View Transactions',
                'description' => 'Track enterprise cash flow, customer invoice balances, sales reports, and recurring billing.',
                'accent_color' => 'from-emerald-500 to-teal-600',
            ]
        );

        DashboardCard::firstOrCreate(
            ['name' => 'Service Workspace & Support'],
            [
                'path' => '/services',
                'button_text' => 'Explore Services',
                'description' => 'Access specialized enterprise migration, cloud infrastructure, and 24/7 technical support.',
                'accent_color' => 'from-purple-500 to-pink-600',
            ]
        );

        // 4. Available Packages & Modules (Package Carts + Nested Packages)
        $cart = PackageCart::firstOrCreate(
            ['cart_name' => 'Nexus Core ERP Suites'],
            [
                'button_name' => 'Explore Core Packages',
                'description' => 'All-in-one business management suites tailored for retail, wholesale, and multi-branch operations.',
                'color_class' => 'from-orange-500 to-amber-600',
            ]
        );

        Package::firstOrCreate(
            ['package_name' => 'Retail Starter Edition'],
            [
                'package_cart_id' => $cart->id,
                'main_topic' => 'Retail Essentials',
                'small_description' => 'Ideal for single-store retail businesses needing fast billing and inventory control.',
                'price' => 45000.00,
                'suitable_business' => 'Single Retail Outlets, Boutiques, Supermarkets',
                'core_features' => 'Barcode Scanner Integration, POS Terminal, Stock History, Basic Reports',
                'benefits' => 'Quick setup, 99.9% uptime, Automated receipts',
                'rating' => 4.9,
                'discount_percentage' => 10.00,
                'discount_description' => '10% Launch Discount',
            ]
        );

        Package::firstOrCreate(
            ['package_name' => 'Enterprise Pro Edition'],
            [
                'package_cart_id' => $cart->id,
                'main_topic' => 'Enterprise Multi-Branch',
                'small_description' => 'Complete ERP solution for multi-branch retail, inventory transfers, and advanced analytics.',
                'price' => 120000.00,
                'suitable_business' => 'Multi-Branch Chains, Distributors, Enterprise Businesses',
                'core_features' => 'Multi-Store Sync, Supplier GRN, Role-Based Access Control, Custom Reports',
                'benefits' => 'Unlimited Users, Priority Support, Custom Integrations',
                'rating' => 5.0,
                'discount_percentage' => 15.00,
                'discount_description' => '15% Enterprise Bundle',
            ]
        );

        // 5. Additional Services
        Service::firstOrCreate(
            ['name' => 'Cloud Hosting & Automated Backup'],
            [
                'category' => 'Cloud & Security',
                'price' => 15000.00,
                'billing_type' => 'monthly',
                'description' => 'Managed cloud server deployment with automated daily database backups and SSL encryption.',
                'is_active' => true,
            ]
        );

        Service::firstOrCreate(
            ['name' => 'ERP System Implementation & Training'],
            [
                'category' => 'Support',
                'price' => 35000.00,
                'billing_type' => 'one-time',
                'description' => 'On-site data migration, employee access training, and custom invoice template setup.',
                'is_active' => true,
            ]
        );

        // 6. ERP Packages for /ERP Page Storefront
        ErpPackage::firstOrCreate(
            ['name' => 'Basic ERP'],
            [
                'price' => 25000.00,
                'suitable_for' => 'Small shops, Startups, Small businesses',
                'features' => 'Customer Management, Product Management, Order Management, Sales Tracking, Basic Reports, 5 User Accounts',
                'benefits' => 'Easy to use, Affordable, Helps manage daily business operations',
                'rating' => '5.0',
            ]
        );

        ErpPackage::firstOrCreate(
            ['name' => 'Standard ERP'],
            [
                'price' => 45000.00,
                'suitable_for' => 'Standard ERP, Medium Outlets, Multi-counters',
                'features' => 'Everything in Basic, Inventory Management, Supplier Management, Invoice Generation, Purchase Management, Dashboard Analytics, 20 User Accounts',
                'benefits' => 'Better inventory control, Detailed business insights, Faster order processing',
                'rating' => '5.0',
            ]
        );

        ErpPackage::firstOrCreate(
            ['name' => 'Premium ERP'],
            [
                'price' => 75000.00,
                'suitable_for' => 'Growing businesses, Companies with multiple departments, Organizations with 50-200 employees',
                'features' => 'Everything in Standard, Employee Management, Leave Management, Attendance Tracking, Customer Relationship Management (CRM), Advanced Inventory Control, Supplier Performance Tracking, Custom Dashboard, Up to 100 User Accounts',
                'benefits' => 'Manage multiple departments in one system, Improve employee productivity, Better customer relationship management, More detailed business reports',
                'rating' => '5.0',
            ]
        );
    }
}

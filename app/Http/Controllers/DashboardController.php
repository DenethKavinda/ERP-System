<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DashboardCard;
use Inertia\Inertia;
use App\Models\PackageCart;
use App\Models\Package;
use App\Models\ErpPackage;
use App\Models\Service;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Render customer/user workspace dashboard node.
     * Eager loads navigation cards, active subscription metadata, and session flash data.
     */
    public function index()
    {
        $navigationCards = DashboardCard::all();

        $user = Auth::user();
        $activeSubscription = null;

        if ($user) {
            $paidPayment = Payment::latestCompletedOrActivePlanForUser($user->id);
            $latestPayment = $paidPayment ?: Payment::latestPlanForUser($user->id);

            // Use paid plan name if paid; otherwise default to ERP Free Starter (never show unpaid pending order)
            $planName = $paidPayment ? $paidPayment->package_name : 'ERP Free Starter';
            
            // Clean billing cycle suffixes (e.g. " (Monthly)", " (Annual Prepay)", " (Yearly)")
            $cleanPlanName = preg_replace('/\s*\((Monthly|Yearly|Annual|Annual Prepay)\)/i', '', $planName);
            $cleanPlanName = trim($cleanPlanName);

            // Resolve structured plan quota limits dynamically from the ErpPackage database model
            $package = ErpPackage::where('name', $cleanPlanName)
                ->orWhere('name', $planName)
                ->orWhere('code', $cleanPlanName)
                ->orWhere('code', $planName)
                ->first();

            if (!$package) {
                $codeKey = match(true) {
                    stripos($planName, 'enterprise') !== false => 'enterprise',
                    stripos($planName, 'professional') !== false || stripos($planName, 'pro') !== false => 'pro',
                    stripos($planName, 'basic') !== false => 'basic',
                    default => 'free'
                };
                $package = ErpPackage::where('code', $codeKey)->first();
            }

            if ($package) {
                $planLimits = [
                    'branches'   => $package->max_branches === -1 ? 'Unlimited' : $package->max_branches,
                    'warehouses' => $package->max_warehouses === -1 ? 'Unlimited' : $package->max_warehouses,
                    'users'      => $package->max_users === -1 ? 'Unlimited' : ($package->max_users >= 50 ? '50+ Users' : $package->max_users),
                    'bills'      => $package->max_monthly_bills === -1 ? 'Unlimited Bills' : ($package->max_products && $package->max_products !== -1 ? "{$package->max_products} Items & Bills" : "{$package->max_monthly_bills} Items & Bills"),
                    'modules'    => $package->modules ?? [],
                ];
            } else {
                $planLimits = [
                    'branches'   => 1,
                    'warehouses' => 1,
                    'users'      => 2,
                    'bills'      => '100 Items & Bills',
                    'modules'    => [],
                ];
            }

            $isAdmin = $user->role === 'admin';

            $isActive = $isAdmin || ($paidPayment 
                && in_array(strtolower($paidPayment->status), ['completed', 'active']) 
                && $paidPayment->expires_at 
                && $paidPayment->expires_at->isFuture());

            $activeSubscription = [
                'plan_name'   => $isAdmin ? 'Nexus ERP Administrator' : $planName,
                'order_id'    => $isAdmin ? 'ADMIN_ACCESS' : ($paidPayment ? $paidPayment->order_id : ($latestPayment ? $latestPayment->order_id : 'TRIAL')),
                'expires_at'  => $isAdmin ? null : ($paidPayment && $paidPayment->expires_at ? $paidPayment->expires_at->toIso8601String() : null),
                'is_active'   => (bool)$isActive,
                'status'      => $isActive ? 'active' : ($paidPayment ? 'expired' : 'trial'),
                'limits'      => $isAdmin ? [
                    'branches'   => 'Unlimited',
                    'warehouses' => 'Unlimited',
                    'users'      => 'Unlimited',
                    'bills'      => 'Unlimited Bills',
                    'modules'    => $package ? ($package->modules ?? []) : ['all'],
                ] : $planLimits,
                'usage'       => [
                    'branches'   => 1,
                    'warehouses' => 1,
                    'users'      => 1,
                ]
            ];
        }

        return Inertia::render('Users/Dashboard', [
            'navigationCards'    => $navigationCards,
            'activeSubscription' => $activeSubscription,
            'erpAppUrl'          => env('ERP_APP_URL', 'http://localhost:5173'),
            'newAccountActivated'=> session('new_account_activated', false),
            'erpLoginEmail'      => session('erp_login_email'),
            'erpProvisioned'     => session('erp_provisioned', false),
            'flashPlanName'      => session('plan_name'),

            // Flash payment info for receipt download
            'flashPayment' => [
                'order_id' => session('payment_success_order_id'),
                'amount'   => session('payment_success_amount'),
                'items'    => session('payment_success_items'),
            ]
        ]);
    }

    /**
     * Render the administrative configuration management portal page
     * for the Central Operations Framework system nodes.
     */
    public function adminIndex()
    {
        return Inertia::render('Admin/DashboardManager', [
            'cards' => DashboardCard::all()
        ]);
    }

    /**
     * Save a brand new Central Operations Framework card layout option to the database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'path' => 'required|string|max:255',
            'button_text' => 'required|string|max:255',
            'description' => 'required|string',
            'accent_color' => 'required|string',
        ]);

        DashboardCard::create($validated);

        return redirect()->back()->with('success', 'Framework Card created successfully.');
    }

    /**
     * Update an existing Central Operations Framework card node within the system.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'path' => 'required|string|max:255',
            'button_text' => 'required|string|max:255',
            'description' => 'required|string',
            'accent_color' => 'required|string',
        ]);

        $card = DashboardCard::findOrFail($id);
        $card->update($validated);

        return redirect()->back()->with('success', 'Framework Card updated successfully.');
    }

    /**
     * Delete an existing Central Operations Framework card from the system database.
     */
    public function destroy($id)
    {
        DashboardCard::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Framework Card deleted successfully.');
    }

    // =========================================================================
    // ADMINISTRATIVE ARCHITECTURE LAYER: PACKAGES & CARTS CRUDS
    // =========================================================================

    /**
     * Render the main administration package feed manager configuration view workspace.
     */
    public function adminPackagesIndex()
    {
        return Inertia::render('Admin/PackagesManager', [
            'carts' => PackageCart::with('packages')->get()
        ]);
    }

    /**
     * Register a new package container group (Cart component) into database logs.
     */
    public function storeCart(Request $request)
    {
        $validated = $request->validate([
            'cart_name' => 'required|string|max:255',
            'button_name' => 'required|string|max:255',
            'description' => 'required|string',
            'color_class' => 'required|string',
            'youtube_link' => 'nullable|url',
        ]);

        PackageCart::create($validated);
        return redirect()->back()->with('success', 'Package Group Cart registered successfully.');
    }

    public function updateCart(Request $request, $id)
    {
        $validated = $request->validate([
            'cart_name' => 'required|string|max:255',
            'button_name' => 'required|string|max:255',
            'description' => 'required|string',
            'color_class' => 'required|string',
            'youtube_link' => 'nullable|url',
        ]);

        $cart = PackageCart::findOrFail($id);
        $cart->update($validated);

        return redirect()->back()->with('success', 'Package Group Cart parameters updated.');
    }

    /**
     * Remove an entire target package cart layout node from the ecosystem database.
     * Note: Cascading foreign relations automatically purge attached individual variants.
     */
    public function destroyCart($id)
    {
        PackageCart::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Package Group Cart removed successfully from ecosystem.');
    }

    /**
     * Deploy a new individual feature variant system package allocated under a parent container.
     */
    public function storePackage(Request $request)
    {
        $validated = $request->validate([
            'package_cart_id' => 'required|exists:package_carts,id',
            'main_topic' => 'required|string|max:255',
            'small_description' => 'required|string',
            'package_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'suitable_business' => 'required|string',
            'core_features' => 'required|string',
            'benefits' => 'required|string',
            'rating' => 'nullable|numeric|between:1,5',
            'discount_percentage' => 'nullable|numeric|between:0,100',
            'discount_description' => 'nullable|string|max:255',
        ]);

        Package::create($validated);
        return redirect()->back()->with('success', 'Package node registered successfully.');
    }

    public function updatePackage(Request $request, $id)
    {
        $validated = $request->validate([
            'package_cart_id' => 'required|exists:package_carts,id',
            'main_topic' => 'required|string|max:255',
            'small_description' => 'required|string',
            'package_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'suitable_business' => 'required|string',
            'core_features' => 'required|string',
            'benefits' => 'required|string',
            'rating' => 'nullable|numeric|between:1,5',
            'discount_percentage' => 'nullable|numeric|between:0,100',
            'discount_description' => 'nullable|string|max:255',
        ]);

        $package = Package::findOrFail($id);
        $package->update($validated);

        return redirect()->back()->with('success', 'Package configuration updated successfully.');
    }

    /**
     * Delete an individual sub-package entry from matching cart relation logs.
     */
    public function destroyPackage($id)
    {
        Package::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Package item removed successfully from group allocation table.');
    }
}

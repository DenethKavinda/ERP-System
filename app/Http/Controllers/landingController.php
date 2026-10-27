<?php

namespace App\Http\Controllers;

use App\Models\DashboardCard;
use App\Models\PackageCart;
use App\Models\Service;
use App\Models\Payment;
use App\Models\ErpPackage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class landingController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $latestPayment = $user
            ? Payment::where('user_id', $user->id)
                ->where('status', 'Completed')
                ->latest()
                ->first()
            : null;

        $planName = $latestPayment ? $latestPayment->package_name : ($user ? 'ERP Free Starter' : null);
        
        $activeSubscription = null;
        if ($user) {
            $package = ErpPackage::where('name', $planName)
                ->orWhere('code', $planName)
                ->first();

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

            $activeSubscription = [
                'plan_name'   => $planName ?: 'ERP Free Starter',
                'order_id'    => $latestPayment ? $latestPayment->order_id : 'TRIAL',
                'expires_at'  => $latestPayment && $latestPayment->expires_at ? $latestPayment->expires_at->toIso8601String() : now()->addDays(30)->toIso8601String(),
                'is_active'   => true,
                'limits'      => $planLimits,
                'usage'       => [
                    'branches'   => 1,
                    'warehouses' => 1,
                    'users'      => 1,
                ]
            ];
        }

        return Inertia::render('landingPage', [
            'navigationCards' => DashboardCard::all(),
            'packageCarts' => PackageCart::with('packages')->get(),
            'services' => Service::where('is_active', true)->get(),
            'activeSubscription' => $activeSubscription,
            'erpAppUrl' => env('ERP_APP_URL', 'http://localhost:5173'),
            'flashPayment' => [
                'order_id' => session('payment_success_order_id'),
                'amount' => session('payment_success_amount'),
                'items' => session('payment_success_items'),
            ],
        ]);
    }
}

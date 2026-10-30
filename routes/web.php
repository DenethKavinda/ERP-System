<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ErpPackageController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\CheckoutController;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\User;
use App\Models\ErpPackage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Http\Controllers\SuccessStoryController;
use App\Http\Controllers\landingController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\KnowledgeCenter;
use App\Http\Controllers\LedgerController;

if (!function_exists('syncErpSubscriptionToBackend')) {
    /**
     * Synchronize a subscriber package change or cancellation directly to the ERP Backend API.
     */
    function syncErpSubscriptionToBackend(string $email, string $planName, string $status = 'active', ?string $expiresAt = null, string $action = 'update', string $billingCycle = 'monthly', ?string $passwordHash = null): bool {
        $apiUrl = config('services.erp.api_url');
        $provisioningKey = config('services.erp.provisioning_key');

        if (empty($apiUrl) || empty($provisioningKey)) {
            Log::warning('ERP subscription sync skipped: API URL or key not configured.');
            return false;
        }

        $portalUser = \App\Models\User::where('email', $email)->first();

        try {
            $payload = [
                'email'         => $email,
                'name'          => $portalUser?->name,
                'business_name' => $portalUser?->business_name,
                'plan'          => $planName,
                'status'        => $status,
                'billing_cycle' => $billingCycle,
                'expires_at'    => $expiresAt,
                'action'        => $action,
            ];

            if (!empty($passwordHash)) {
                $payload['password_hash'] = $passwordHash;
            }

            $response = Http::withHeaders([
                'X-ERP-Provisioning-Key' => $provisioningKey,
                'Accept'                 => 'application/json',
                'Content-Type'           => 'application/json',
            ])->timeout(15)->post("{$apiUrl}/api/internal/subscriptions/sync", $payload);

            if ($response->successful()) {
                Log::info("ERP subscription synced successfully for {$email}", $response->json());
                return true;
            }

            Log::error("ERP subscription sync failed for {$email}", [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            return false;
        } catch (\Throwable $e) {
            Log::error("ERP subscription sync exception for {$email}: " . $e->getMessage());
            return false;
        }
    }
}

// ==========================================
// 1. PUBLIC VIEW & PRICING ROUTES (Login Optional)
// ==========================================
Route::get('/', [landingController::class, 'index'])->name('landing');
Route::get('/dashboard-user', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/ERP', [ErpPackageController::class, 'index'])->name('erp.index');
Route::get('/services', [ServiceController::class, 'index'])->name('services.public');
Route::get('/success-stories', [SuccessStoryController::class, 'index'])->name('success.stories.index');
Route::get('/contact-consultation', fn() => Inertia::render('Users/ContactConsultation'))->name('contact.consultation');
Route::get('/knowledge-center', [KnowledgeCenter::class, 'viewKnowledgeCenter'])->name('knowledge.public');
Route::get('/knowledge-center/download/{id}', [KnowledgeCenter::class, 'download'])->name('knowledge.download');

// Public Legal & Policy Pages
Route::get('/terms', fn() => Inertia::render('Legal/TermsOfService'))->name('legal.terms');
Route::get('/privacy', fn() => Inertia::render('Legal/PrivacyPolicy'))->name('legal.privacy');
Route::get('/refund-policy', fn() => Inertia::render('Legal/RefundPolicy'))->name('legal.refund');

// Public Checkout & Billing Endpoints
Route::post('/checkout/initialize', [CheckoutController::class, 'initialize'])->name('checkout.initialize');
Route::post('/checkout/services', [CheckoutController::class, 'initializeServices'])->name('checkout.services');
Route::get('/checkout/receipt/download', [CheckoutController::class, 'downloadReceipt'])->name('receipt.download');
Route::get('/checkout/receipt/{orderId}', [CheckoutController::class, 'downloadReceiptByOrder'])->name('receipt.download.by-order');
Route::post('/payhere/webhook', [CheckoutController::class, 'handleWebhook'])->name('payhere.webhook');

// SECURE CALLBACK INTERCEPTOR GATE: PayHere Processing Node Redirect
Route::get('/checkout/success-callback', function (Request $request) {
    session()->flash('payment_success_order_id', $request->get('order_id'));
    session()->flash('payment_success_amount', $request->get('amount', '0.00'));
    session()->flash('payment_success_items', $request->get('items', 'Package Purchase'));

    return redirect()->route('dashboard');
})->name('checkout.success.callback');

// Public Auth Action Layer endpoints 
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);

// Logout Session Endpoint
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// ==========================================
// 2. SHARED AUTHENTICATED ROUTES (Protected User Workspaces)
// ==========================================
Route::middleware(['auth', 'verified'])->group(function () {
    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Customer Financial Ledger / Transaction History (F-03, F-16, F-43)
    Route::get('/ledger', [LedgerController::class, 'index'])->name('ledger.index');

    // Customer Support Grievance & Complaint Tickets (F-01, F-14, F-27, F-41)
    Route::get('/complaints', [ComplaintController::class, 'create'])->name('complaints.create');
    Route::post('/complaints', [ComplaintController::class, 'store'])->name('complaints.store');
    Route::delete('/complaints/user-remove/{id}', [ComplaintController::class, 'userDestroy'])->name('complaints.user-destroy');
    Route::get('/complaints/download/{id}', [ComplaintController::class, 'downloadUserAttachment'])->name('complaints.download');
    Route::get('/complaints/reply-download/{id}', [ComplaintController::class, 'downloadReplyAttachment'])->name('complaints.reply-download');

    // Submit Customer Success Story / Review
    Route::post('/success-stories', [SuccessStoryController::class, 'store'])->name('success.stories.store');
});

// ==========================================
// 2. PROTECTED ADMINISTRATIVE ROUTES (Admins Only)
// ==========================================
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    // Super Admin Operations Dashboard
    Route::get('/dashboard', function () {
        $totalCustomers = \App\Models\User::where('role', 'user')->count();
        $activeCount = \App\Models\Payment::where('status', 'Completed')
            ->where('expires_at', '>', now())
            ->distinct('user_id')
            ->count('user_id');
        $expiredCount = max(0, $totalCustomers - $activeCount);
        $totalRevenue = \App\Models\Payment::where('status', 'Completed')->sum('amount');
        $packagesCount = \App\Models\ErpPackage::count();

        $recentSubscribers = \App\Models\User::where('role', 'user')
            ->orderBy('created_at', 'desc')
            ->take(4)
            ->get()
            ->map(function ($u) {
                $p = \App\Models\Payment::where('user_id', $u->id)->latest()->first();
                return [
                    'id'            => $u->id,
                    'customer_id'   => $u->customer_id,
                    'name'          => $u->name,
                    'business_name' => $u->business_name,
                    'email'         => $u->email,
                    'plan_name'     => $p?->package_name ?? 'No Plan',
                    'is_active'     => (bool)($p && $p->status === 'Completed' && $p->expires_at && $p->expires_at->isFuture()),
                    'created_at'    => $u->created_at->toIso8601String(),
                ];
            });

        return Inertia::render('Admin/AdminDashboard', [
            'metrics' => [
                'totalCustomers' => $totalCustomers,
                'activeCount'    => $activeCount,
                'expiredCount'   => $expiredCount,
                'totalRevenue'   => $totalRevenue,
                'packagesCount'  => $packagesCount,
            ],
            'recentSubscribers' => $recentSubscribers,
        ]);
    })->name('dashboard');

    // Admin Services Management (F-06, F-21, F-22, F-54)
    Route::get('/services', [ServiceController::class, 'adminIndex'])->name('services.index');
    Route::post('/services', [ServiceController::class, 'store'])->name('services.store');
    Route::put('/services/{id}', [ServiceController::class, 'update'])->name('services.update');
    Route::delete('/services/{id}', [ServiceController::class, 'destroy'])->name('services.destroy');
    Route::get('/adminservices', fn() => redirect()->route('admin.services.index'))->name('legacy.services');

    // Admin Dashboard Cards Manager (F-04, F-19, F-23, F-55)
    Route::get('/dashboard-manager', [DashboardController::class, 'adminIndex'])->name('dashboard.manager');
    Route::post('/dashboard-manager', [DashboardController::class, 'store'])->name('dashboard.store');
    Route::put('/dashboard-manager/{id}', [DashboardController::class, 'update'])->name('dashboard.update');
    Route::delete('/dashboard-manager/{id}', [DashboardController::class, 'destroy'])->name('dashboard.destroy');

    // Admin Packages Manager (Legacy Cart & Items) (F-05, F-20, F-24, F-56)
    Route::get('/packages', [DashboardController::class, 'adminPackagesIndex'])->name('packages.manager');
    Route::post('/packages/cart', [DashboardController::class, 'storeCart'])->name('packages.cart.store');
    Route::put('/packages/cart/{id}', [DashboardController::class, 'updateCart'])->name('packages.cart.update');
    Route::delete('/packages/cart/{id}', [DashboardController::class, 'destroyCart'])->name('packages.cart.destroy');
    Route::post('/packages/item', [DashboardController::class, 'storePackage'])->name('packages.item.store');
    Route::put('/packages/item/{id}', [DashboardController::class, 'updatePackage'])->name('packages.item.update');
    Route::delete('/packages/item/{id}', [DashboardController::class, 'destroyPackage'])->name('packages.item.destroy');

    // Admin Knowledge Base Manager (F-02, F-18, F-26, F-53)
    Route::get('/knowledge-manager', [KnowledgeCenter::class, 'adminIndex'])->name('knowledge.manager');
    Route::post('/knowledge-manager', [KnowledgeCenter::class, 'store'])->name('knowledge.store');
    Route::post('/knowledge-manager/{id}', [KnowledgeCenter::class, 'update'])->name('knowledge.update');
    Route::delete('/knowledge-manager/{id}', [KnowledgeCenter::class, 'destroy'])->name('knowledge.destroy');

    // Admin Complaints Queue & Resolution (F-01, F-17, F-25, F-52)
    Route::get('/complaints', [ComplaintController::class, 'adminIndex'])->name('complaints.index');
    Route::post('/complaints/{id}/reply', [ComplaintController::class, 'storeReply'])->name('complaints.reply');
    Route::put('/complaints/{id}/status', [ComplaintController::class, 'updateStatus'])->name('complaints.status');
    Route::delete('/complaints/{id}', [ComplaintController::class, 'destroy'])->name('complaints.destroy');

    // Administrative Workspace Engine Routes
    Route::get('/erp-packages', [ErpPackageController::class, 'adminIndex'])->name('packages.index');
    Route::post('/erp-packages', [ErpPackageController::class, 'store'])->name('packages.store');
    Route::put('/erp-packages/{id}', [ErpPackageController::class, 'update'])->name('packages.update');
    Route::delete('/erp-packages/{id}', [ErpPackageController::class, 'destroy'])->name('packages.destroy');

    Route::get('/success-stories', [SuccessStoryController::class, 'adminIndex'])->name('success.stories.index');
    Route::post('/success-stories/{id}/approve', [SuccessStoryController::class, 'approve'])->name('success.stories.approve');
    Route::post('/success-stories/{id}/unapprove', [SuccessStoryController::class, 'unapprove'])->name('success.stories.unapprove');
    Route::delete('/success-stories/{id}', [SuccessStoryController::class, 'destroy'])->name('success.stories.destroy');

    // Customer Subscription Management
    Route::get('/subscribers', function () {
        $users = \App\Models\User::where('role', 'user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                $latestPayment = \App\Models\Payment::latestSyncablePlanForUser($user->id);

                $manifest = is_array($latestPayment?->addons_manifest) ? $latestPayment->addons_manifest : [];
                $erpSync = is_array($manifest['erp_sync'] ?? null) ? $manifest['erp_sync'] : [];

                return [
                    'id'            => $user->id,
                    'customer_id'   => $user->customer_id,
                    'name'          => $user->name,
                    'business_name' => $user->business_name,
                    'email'         => $user->email,
                    'mobile_number' => $user->mobile_number,
                    'nic'           => $user->nic,
                    'plan_name'     => $latestPayment?->package_name ?? 'No Plan',
                    'billing_cycle' => $manifest['billing_cycle'] ?? 'monthly',
                    'bank_ref'      => $latestPayment?->payment_id ?? '',
                    'amount'        => (float) ($latestPayment?->amount ?? 0),
                    'is_active'     => $latestPayment 
                        && in_array(strtolower((string)$latestPayment->status), ['completed', 'active']) 
                        && $latestPayment->expires_at 
                        && $latestPayment->expires_at->isFuture(),
                    'expires_at'    => $latestPayment?->expires_at?->toIso8601String(),
                    'created_at'    => $user->created_at->toIso8601String(),
                    'sync_status'   => $erpSync['status'] ?? ($latestPayment ? 'unknown' : 'none'),
                ];
            });

        return Inertia::render('Admin/Subscribers', [
            'subscribers' => $users,
            'packages'    => \App\Models\ErpPackage::orderBy('price', 'asc')->get(['id', 'name', 'code', 'price']),
            'flash'       => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    })->name('subscribers.index');

    Route::put('/subscribers/{id}', function (\Illuminate\Http\Request $request, $id) {
        $request->validate([
            'package_name'  => 'required|string',
            'billing_cycle' => 'nullable|string|in:monthly,annual',
            'bank_ref'      => 'nullable|string|max:100',
            'amount'        => 'nullable|numeric|min:0',
            'expires_at'    => 'nullable|date',
        ]);

        $user = User::findOrFail($id);
        $cycle = $request->input('billing_cycle', 'monthly') ?: 'monthly';
        $defaultDays = $cycle === 'annual' ? 365 : 30;
        $expiresAt = $request->expires_at ? Carbon::parse($request->expires_at) : now()->addDays($defaultDays);

        // Fetch official package price by billing cycle
        $pkg = ErpPackage::where('name', $request->package_name)
            ->orWhere('code', strtolower($request->package_name))
            ->first();

        $basePrice = 0;
        if ($pkg) {
            $basePrice = $cycle === 'annual' 
                ? (float) ($pkg->annual_price ?: ($pkg->price * 10)) 
                : (float) $pkg->price;
        }

        $finalAmount = $request->filled('amount') && (float) $request->amount > 0 
            ? (float) $request->amount 
            : $basePrice;

        $bankRef = $request->filled('bank_ref') 
            ? trim($request->bank_ref) 
            : ('OFFLINE_' . strtoupper(uniqid()));

        $addonsManifest = [
            'billing_cycle'  => $cycle,
            'bank_ref'       => $bankRef,
            'payment_method' => 'bank_transfer',
            'verified_by'    => auth()->user()?->email ?? 'admin',
            'verified_at'    => now()->toIso8601String(),
        ];

        $targetPayment = Payment::latestCompletedOrActivePlanForUser($id)
            ?: Payment::where('user_id', $id)->planSubscriptions()->latest()->first();

        // Persist sync intent before the HTTP call
        $addonsManifest['erp_sync'] = [
            'status'       => 'pending',
            'attempted_at' => now()->toIso8601String(),
        ];

        if ($targetPayment) {
            $targetPayment->update([
                'package_name'    => $request->package_name,
                'payment_id'      => $bankRef,
                'expires_at'      => $expiresAt,
                'status'          => 'Completed',
                'base_price'      => $basePrice,
                'amount'          => $finalAmount,
                'addons_manifest' => $addonsManifest,
            ]);
        } else {
            $targetPayment = Payment::create([
                'order_id'        => 'ADMIN_' . strtoupper(uniqid()),
                'payment_id'      => $bankRef,
                'user_id'         => $id,
                'package_name'    => $request->package_name,
                'base_price'      => $basePrice,
                'addons_total'    => 0,
                'addons_manifest' => $addonsManifest,
                'amount'          => $finalAmount,
                'currency'        => 'LKR',
                'status'          => 'Completed',
                'expires_at'      => $expiresAt,
            ]);
        }

        // Atomically synchronize package, cycle, and status to ERP Backend
        $synced = syncErpSubscriptionToBackend(
            $user->email,
            $request->package_name,
            'active',
            $expiresAt->toIso8601String(),
            'update',
            $cycle,
            $user->password
        );

        $addonsManifest['erp_sync'] = [
            'status'     => $synced ? 'synced' : 'failed',
            'synced_at'  => now()->toIso8601String(),
            'last_error' => $synced ? null : 'ERP backend unreachable or rejected subscription sync request',
        ];
        $targetPayment->update(['addons_manifest' => $addonsManifest]);

        if (!$synced) {
            return redirect()->back()->with('error', 'Package recorded locally, but ERP subscription sync failed. You can use Retry Sync once backend is reachable.');
        }

        return redirect()->back()->with('success', 'Customer package updated and synchronized to ERP system successfully.');
    })->name('subscribers.update');

    // Terminate (expire immediately and suspend ERP access)
    Route::post('/subscribers/{id}/terminate', function ($id) {
        $user = User::findOrFail($id);
        $payment = Payment::latestSyncablePlanForUser($id);
        $manifest = is_array($payment?->addons_manifest) ? $payment->addons_manifest : [];

        $manifest['erp_sync'] = [
            'status'       => 'pending',
            'action'       => 'terminate',
            'attempted_at' => now()->toIso8601String(),
        ];
        if ($payment) {
            $payment->update([
                'expires_at'      => now()->subDay(),
                'status'          => 'Terminated',
                'addons_manifest' => $manifest,
            ]);
        }

        // Atomically sync cancellation to ERP Backend
        $synced = syncErpSubscriptionToBackend(
            $user->email,
            'free',
            'cancelled',
            now()->subDay()->toIso8601String(),
            'terminate'
        );

        $manifest['erp_sync'] = [
            'status'     => $synced ? 'synced' : 'failed',
            'action'     => 'terminate',
            'synced_at'  => now()->toIso8601String(),
            'last_error' => $synced ? null : 'Failed to synchronize termination to ERP Backend',
        ];
        if ($payment) {
            $payment->update(['addons_manifest' => $manifest]);
        }

        if (!$synced) {
            return redirect()->back()->with('error', 'Subscription terminated locally, but ERP cancellation sync failed. You can retry sync.');
        }

        return redirect()->back()->with('success', 'Subscription terminated and ERP access revoked successfully.');
    })->name('subscribers.terminate');

    // Reactivate (restore term and ERP access)
    Route::post('/subscribers/{id}/reactivate', function ($id) {
        $user = User::findOrFail($id);
        $payment = Payment::latestSyncablePlanForUser($id);

        $reactivatePlan = $payment ? $payment->package_name : 'ERP Free Starter';
        $manifest = is_array($payment?->addons_manifest) ? $payment->addons_manifest : [];
        $cycle = $manifest['billing_cycle'] ?? 'monthly';
        $days = $cycle === 'annual' ? 365 : 30;
        $expiresAt = now()->addDays($days);

        $manifest['erp_sync'] = [
            'status'       => 'pending',
            'action'       => 'reactivate',
            'attempted_at' => now()->toIso8601String(),
        ];
        if ($payment) {
            $payment->update([
                'expires_at'      => $expiresAt,
                'status'          => 'Completed',
                'addons_manifest' => $manifest,
            ]);
        }

        // Atomically sync reactivation to ERP Backend
        $synced = syncErpSubscriptionToBackend(
            $user->email,
            $reactivatePlan,
            'active',
            $expiresAt->toIso8601String(),
            'reactivate',
            $cycle
        );

        $manifest['erp_sync'] = [
            'status'     => $synced ? 'synced' : 'failed',
            'action'     => 'reactivate',
            'synced_at'  => now()->toIso8601String(),
            'last_error' => $synced ? null : 'Failed to synchronize reactivation to ERP Backend',
        ];
        if ($payment) {
            $payment->update(['addons_manifest' => $manifest]);
        }

        if (!$synced) {
            return redirect()->back()->with('error', 'Subscription reactivated locally, but ERP sync failed. You can retry sync.');
        }

        return redirect()->back()->with('success', 'Subscription reactivated and restored in ERP successfully.');
    })->name('subscribers.reactivate');

    // Retry synchronization with ERP Backend for a subscriber
    Route::post('/subscribers/{id}/retry-sync', function ($id) {
        $user = User::findOrFail($id);
        $payment = Payment::latestSyncablePlanForUser($id);
        if (!$payment) {
            return redirect()->back()->with('error', "No paid subscription found to synchronize for {$user->name}. Unpaid checkout attempts cannot be synced.");
        }

        $manifest = is_array($payment->addons_manifest) ? $payment->addons_manifest : [];
        $cycle = $manifest['billing_cycle'] ?? 'monthly';
        $isActive = in_array(strtolower((string)$payment->status), ['completed', 'active']) 
            && $payment->expires_at 
            && $payment->expires_at->isFuture();
        $status = $isActive ? 'active' : 'suspended';
        $action = $isActive ? 'update' : 'terminate';

        $synced = syncErpSubscriptionToBackend(
            $user->email,
            $payment->package_name,
            $status,
            $payment->expires_at?->toIso8601String(),
            $action,
            $cycle
        );

        $manifest['erp_sync'] = [
            'status'       => $synced ? 'synced' : 'failed',
            'synced_at'    => now()->toIso8601String(),
            'attempted_at' => now()->toIso8601String(),
            'last_error'   => $synced ? null : 'ERP backend unreachable or rejected request',
        ];
        $payment->update(['addons_manifest' => $manifest]);

        if ($synced) {
            return redirect()->back()->with('success', "ERP subscription successfully synced for {$user->name}.");
        }

        return redirect()->back()->with('error', "ERP subscription sync failed for {$user->name}. Check backend connection.");
    })->name('subscribers.retry-sync');

    Route::get('/transactions', function () {
        return Inertia::render('Admin/Transactions', [
            // Ensure you load the relationship inside your Controller or Route: Payment::with('user')->get()
            'payments' => Payment::with('user')->latest()->get()
        ]);
    })->name('transactions.index');

    Route::patch('/transactions/{id}/status', function (Illuminate\Http\Request $request, $id) {
        $request->validate([
            'status' => 'required|in:pending,completed,failed',
        ]);

        $payment = \App\Models\Payment::findOrFail($id);
        $normalizedStatus = ucfirst(strtolower($request->status));
        $payment->update(['status' => $normalizedStatus]);

        if ($payment->isPlanSubscription() && $payment->user && $normalizedStatus === 'Completed') {
            $manifest = is_array($payment->addons_manifest) ? $payment->addons_manifest : [];
            $cycle = $manifest['billing_cycle'] ?? 'monthly';
            $expiresAt = $payment->expires_at ?: ($cycle === 'annual' ? now()->addYear() : now()->addDays(30));
            $payment->update(['expires_at' => $expiresAt]);

            syncErpSubscriptionToBackend(
                $payment->user->email,
                $payment->package_name,
                'active',
                $expiresAt->toIso8601String(),
                'update',
                $cycle
            );
        }

        return redirect()->back();
    })->name('transactions.update-status');

    Route::get('/transactions/export-excel', function (Illuminate\Http\Request $request) {
        $search = $request->get('search');

        // Fetch the transactions using the exact same filters applied on the frontend screen
        $query = \App\Models\Payment::with('user');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('order_id', 'LIKE', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'LIKE', "%{$search}%")
                            ->orWhere('email', 'LIKE', "%{$search}%");
                    });
            });
        }

        $payments = $query->latest()->get();

        // Generate CSV/Excel Content Stream Header rows
        $filename = "Transactions_Report_" . date('Y-m-d_H-i-s') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename={$filename}",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['Transaction ID', 'User Name', 'User Email', 'Status', 'Amount (LKR)', 'Settlement Date'];

        $callback = function () use ($payments, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($payments as $payment) {
                fputcsv($file, [
                    $payment->order_id,
                    $payment->user ? $payment->user->name : 'Guest User',
                    $payment->user ? $payment->user->email : 'N/A',
                    strtoupper($payment->status),
                    number_format($payment->amount, 2, '.', ''),
                    $payment->updated_at
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    })->name('transactions.export-excel');

    Route::get('/transactions/export-summary-pdf', function (Illuminate\Http\Request $request) {
        $search = $request->get('search');

        $query = \App\Models\Payment::with('user');
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('order_id', 'LIKE', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'LIKE', "%{$search}%")
                            ->orWhere('email', 'LIKE', "%{$search}%");
                    });
            });
        }

        $payments = $query->latest()->get();

        $totalCount = $payments->count();
        $completedCount = $payments->filter(fn($p) => strtolower($p->status) === 'completed')->count();
        $pendingCount = $payments->filter(fn($p) => strtolower($p->status) === 'pending')->count();
        $failedCount = $payments->filter(fn($p) => strtolower($p->status) === 'failed')->count();

        $completedPercentage = $totalCount > 0 ? round(($completedCount / $totalCount) * 100, 1) : 0;
        $pendingPercentage = $totalCount > 0 ? round(($pendingCount / $totalCount) * 100, 1) : 0;
        $failedPercentage = $totalCount > 0 ? round(($failedCount / $totalCount) * 100, 1) : 0;

        $completedSum = $payments->filter(fn($p) => strtolower($p->status) === 'completed')->sum('amount');
        $pendingSum = $payments->filter(fn($p) => strtolower($p->status) === 'pending')->sum('amount');
        $totalRevenueSum = $payments->sum('amount');

        $chartConfig = urlencode(json_encode([
            'type' => 'pie',
            'data' => [
                'labels' => ["Completed ({$completedPercentage}%)", "Pending ({$pendingPercentage}%)", "Failed ({$failedPercentage}%)"],
                'datasets' => [['data' => [$completedCount, $pendingCount, $failedCount], 'backgroundColor' => ['#10b981', '#f59e0b', '#ef4444']]]
            ],
            'options' => ['plugins' => ['legend' => ['position' => 'bottom']]]
        ]));
        $chartUrl = "https://quickchart.io/chart?c={$chartConfig}&w=400&h=250";

        // Pass data array context down to the Blade file template
        $pdf = Barryvdh\DomPDF\Facade\Pdf::loadView('admin.pdf.transactions-summary', compact(
            'search',
            'totalCount',
            'completedCount',
            'pendingCount',
            'failedCount',
            'completedPercentage',
            'pendingPercentage',
            'failedPercentage',
            'completedSum',
            'pendingSum',
            'totalRevenueSum',
            'chartUrl'
        ));

        return $pdf->download('Transactions_Financial_Summary_' . date('Y-m-d_His') . '.pdf');
    })->name('transactions.export-summary-pdf');
});

require __DIR__ . '/auth.php';

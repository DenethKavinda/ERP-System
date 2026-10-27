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
use App\Http\Controllers\SuccessStoryController;
use App\Http\Controllers\landingController;

// ==========================================
// 1. PUBLIC VIEW & PRICING ROUTES (Login Optional)
// ==========================================
Route::get('/', [landingController::class, 'index'])->name('landing');
Route::get('/dashboard-user', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/ERP', [ErpPackageController::class, 'index'])->name('erp.index');
Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
Route::get('/success-stories', [SuccessStoryController::class, 'index'])->name('success.stories.index');

// Public Checkout & Billing Endpoints
Route::post('/checkout/initialize', [CheckoutController::class, 'initialize'])->name('checkout.initialize');
Route::post('/checkout/services', [CheckoutController::class, 'initializeServices'])->name('checkout.services');
Route::get('/checkout/receipt/download', [CheckoutController::class, 'downloadReceipt'])->name('receipt.download');
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
            ->take(6)
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

    // Legacy redirects to keep bookmarks working
    Route::get('/dashboard-manager', fn() => redirect()->route('admin.dashboard'))->name('dashboard.manager');
    Route::get('/packages', fn() => redirect()->route('admin.packages.index'))->name('packages.manager');
    Route::get('/adminservices', fn() => redirect()->route('admin.dashboard'))->name('services.index');

    // Administrative Workspace Engine Routes
    Route::get('/erp-packages', [ErpPackageController::class, 'adminIndex'])->name('packages.index');
    Route::post('/erp-packages', [ErpPackageController::class, 'store'])->name('packages.store');
    Route::put('/erp-packages/{id}', [ErpPackageController::class, 'update'])->name('packages.update');
    Route::delete('/erp-packages/{id}', [ErpPackageController::class, 'destroy'])->name('packages.destroy');

    Route::get('/success-stories', [SuccessStoryController::class, 'adminIndex'])->name('success.stories.index');

    // Customer Subscription Management
    Route::get('/subscribers', function () {
        $users = \App\Models\User::where('role', 'user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                $latestPayment = \App\Models\Payment::where('user_id', $user->id)
                    ->latest()
                    ->first();

                return [
                    'id'            => $user->id,
                    'customer_id'   => $user->customer_id,
                    'name'          => $user->name,
                    'business_name' => $user->business_name,
                    'email'         => $user->email,
                    'mobile_number' => $user->mobile_number,
                    'nic'           => $user->nic,
                    'plan_name'     => $latestPayment?->package_name ?? 'No Plan',
                    'is_active'     => $latestPayment && $latestPayment->expires_at && $latestPayment->expires_at->isFuture(),
                    'expires_at'    => $latestPayment?->expires_at?->toIso8601String(),
                    'created_at'    => $user->created_at->toIso8601String(),
                ];
            });

        return Inertia::render('Admin/Subscribers', [
            'subscribers' => $users,
        ]);
    })->name('subscribers.index');

    Route::put('/subscribers/{id}', function (\Illuminate\Http\Request $request, $id) {
        $request->validate([
            'package_name' => 'required|string',
            'expires_at'   => 'nullable|date',
        ]);

        $expiresAt = $request->expires_at ?: now()->addDays(30);

        $latestPayment = \App\Models\Payment::where('user_id', $id)->latest()->first();

        if ($latestPayment) {
            $latestPayment->update([
                'package_name' => $request->package_name,
                'expires_at'   => $expiresAt,
                'status'       => 'Completed',
            ]);
        } else {
            \App\Models\Payment::create([
                'order_id'     => 'ADMIN_' . strtoupper(uniqid()),
                'user_id'      => $id,
                'package_name' => $request->package_name,
                'base_price'   => 0,
                'addons_total' => 0,
                'amount'       => 0,
                'currency'     => 'LKR',
                'status'       => 'Completed',
                'expires_at'   => $expiresAt,
            ]);
        }

        return redirect()->back();
    })->name('subscribers.update');

    // Terminate (expire immediately)
    Route::post('/subscribers/{id}/terminate', function ($id) {
        $payment = \App\Models\Payment::where('user_id', $id)->latest()->first();
        if ($payment) {
            $payment->update(['expires_at' => now()->subDay(), 'status' => 'Terminated']);
        }
        return redirect()->back();
    })->name('subscribers.terminate');

    // Reactivate (30 days from now)
    Route::post('/subscribers/{id}/reactivate', function ($id) {
        $payment = \App\Models\Payment::where('user_id', $id)->latest()->first();
        if ($payment) {
            $payment->update(['expires_at' => now()->addDays(30), 'status' => 'Completed']);
        }
        return redirect()->back();
    })->name('subscribers.reactivate');

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
        $payment->update(['status' => $request->status]);

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

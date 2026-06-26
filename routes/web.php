<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ErpPackageController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\KnowledgeCenter;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\CheckoutController;
use Illuminate\Http\Request;
use App\Http\Controllers\LedgerController;
use App\Models\Payment;

// Public Auth Action Layer endpoints 
Route::get('/', [AuthController::class, 'showLogin']);
Route::post('/', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);

// Logout Session Endpoint
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// ==========================================
// 1. SHARED AUTHENTICATED ROUTES (All Logged-In Roles)
// ==========================================
Route::middleware(['auth', 'verified'])->group(function () {

    // SECURE CALLBACK INTERCEPTOR GATE: PayHere Processing Node Redirect
    Route::get('/checkout/success-callback', function (Request $request) {
        session()->flash('payment_success_order_id', $request->get('order_id'));
        session()->flash('payment_success_amount', $request->get('amount', '0.00'));
        session()->flash('payment_success_items', $request->get('items', 'Package Purchase'));

        return redirect()->route('dashboard');
    })->name('checkout.success.callback');

    // User Workspace Interfaces
    Route::get('/dashboard-user', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/ERP', [ErpPackageController::class, 'index'])->name('erp.index');
    Route::get('/services', [ServiceController::class, 'index'])->name('services.index');

    Route::get('/knowledge-center', [KnowledgeCenter::class, 'viewKnowledgeCenter'])->name('knowledge.center');
    Route::get('/knowledge-center/download/{id}', [KnowledgeCenter::class, 'download'])->name('knowledge.download');

    // 🎫 Grievance Document Handling Matrix
    Route::get('/complaints', [ComplaintController::class, 'create'])->name('complaints.create');
    Route::post('/complaints', [ComplaintController::class, 'store'])->name('complaints.store');

    // Non-overlapping distinct secure document streaming gateways
    Route::get('/complaints/download/{id}', [ComplaintController::class, 'downloadUserAttachment'])->name('complaints.download');
    Route::get('/complaints/reply-download/{id}', [ComplaintController::class, 'downloadReplyAttachment'])->name('complaints.reply.download');

    Route::delete('/complaints/user-remove/{id}', [ComplaintController::class, 'userDestroy'])->name('complaints.user.destroy');

    // Checkout Billing & Invoicing Actions
    Route::post('/checkout/initialize', [CheckoutController::class, 'initialize'])->name('checkout.initialize');
    Route::get('/checkout/receipt/download', [CheckoutController::class, 'downloadReceipt'])->name('receipt.download');
    Route::post('/payhere/webhook', [CheckoutController::class, 'handleWebhook'])->name('payhere.webhook');

    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Transactional Ledger Matrix Entryways
    Route::get('/ledger', [LedgerController::class, 'index'])->name('ledger.index');
    Route::get('/ledger/receipt/{order_id}', [CheckoutController::class, 'downloadReceiptByOrder'])->name('ledger.receipt.download');

    // Service Marketplace Payment Gateway Routes
    Route::post('/checkout/services', [CheckoutController::class, 'initializeServices'])->name('checkout.services');
});

// ==========================================
// 2. PROTECTED ADMINISTRATIVE ROUTES (Admins Only)
// ==========================================
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    // Administrative Dashboard Control System
    Route::get('/dashboard-manager', [DashboardController::class, 'adminIndex'])->name('dashboard.manager');
    Route::post('/dashboard-manager', [DashboardController::class, 'store'])->name('dashboard.store');
    Route::delete('/dashboard-manager/{id}', [DashboardController::class, 'destroy'])->name('dashboard.destroy');
    Route::put('/dashboard-manager/{id}', [DashboardController::class, 'update'])->name('dashboard.update');

    // Packages Management
    Route::get('/packages', [DashboardController::class, 'adminPackagesIndex'])->name('packages.manager');
    Route::post('/packages/cart', [DashboardController::class, 'storeCart'])->name('packages.cart.store');
    Route::post('/packages/item', [DashboardController::class, 'storePackage'])->name('packages.item.store');
    Route::delete('/packages/cart/{id}', [DashboardController::class, 'destroyCart'])->name('packages.cart.destroy');
    Route::put('/packages/cart/{id}', [DashboardController::class, 'updateCart'])->name('packages.cart.update');
    Route::delete('/packages/item/{id}', [DashboardController::class, 'destroyPackage'])->name('packages.item.destroy');
    Route::put('/packages/item/{id}', [DashboardController::class, 'updatePackage'])->name('packages.item.update');

    // Service Management Panels
    Route::get('/adminservices', [ServiceController::class, 'adminIndex'])->name('services.index');
    Route::post('/adminservices', [ServiceController::class, 'store'])->name('services.store');
    Route::delete('/adminservices/{id}', [ServiceController::class, 'destroy'])->name('services.destroy');
    Route::put('/adminservices/{id}', [ServiceController::class, 'update'])->name('services.update');

    // Administrative Workspace Engine Routes
    Route::get('/erp-packages', [ErpPackageController::class, 'adminIndex'])->name('packages.index');
    Route::post('/erp-packages', [ErpPackageController::class, 'store'])->name('packages.store');
    Route::put('/erp-packages/{id}', [ErpPackageController::class, 'update'])->name('packages.update');
    Route::delete('/erp-packages/{id}', [ErpPackageController::class, 'destroy'])->name('packages.destroy');

    // Administrative Complaints Management Console
    Route::get('/complaints', [ComplaintController::class, 'adminIndex'])->name('complaints.index');
    Route::put('/complaints/{id}/status', [ComplaintController::class, 'updateStatus'])->name('complaints.status');
    Route::delete('/complaints/{id}', [ComplaintController::class, 'destroy'])->name('complaints.destroy');
    Route::post('/complaints/{id}/reply', [ComplaintController::class, 'storeReply'])->name('complaints.reply');

    // Administrative Knowledge Center Management Console
    Route::get('/knowledge-manager', [KnowledgeCenter::class, 'adminIndex'])->name('knowledge.manager');
    Route::post('/knowledge-manager', [KnowledgeCenter::class, 'store'])->name('knowledge.store');
    Route::delete('/knowledge-manager/{id}', [KnowledgeCenter::class, 'destroy'])->name('knowledge.destroy');
    Route::post('/knowledge-manager/{id}', [KnowledgeCenter::class, 'update'])->name('knowledge.update');


    Route::get('/transactions', function () {
        return Inertia::render('Admin/Transactions', [
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

        $filename = "Transactions_Report_" . date('Y-m-d_H-i-s') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename={$filename}",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        // 🌟 'Status' header removed
        $columns = ['Transaction ID', 'User Name', 'User Email', 'Amount (LKR)', 'Settlement Date'];

        $callback = function () use ($payments, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($payments as $payment) {
                // 🌟 Exact matching 5 items aligned cleanly to the 5 columns above
                fputcsv($file, [
                    $payment->order_id,
                    $payment->user ? $payment->user->name : 'Guest User',
                    $payment->user ? $payment->user->email : 'N/A',
                    number_format($payment->amount, 2, '.', ''),
                    $payment->updated_at
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    })->name('transactions.export-excel');
});


// Inside your admin middleware route group prefix('admin'):
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
    $completedCount = $payments->where('status', 'completed')->count();
    $pendingCount = $payments->where('status', 'pending')->count();
    $failedCount = $payments->where('status', 'failed')->count();

    $completedPercentage = $totalCount > 0 ? round(($completedCount / $totalCount) * 100, 1) : 0;
    $pendingPercentage = $totalCount > 0 ? round(($pendingCount / $totalCount) * 100, 1) : 0;
    $failedPercentage = $totalCount > 0 ? round(($failedCount / $totalCount) * 100, 1) : 0;

    $completedSum = $payments->where('status', 'completed')->sum('amount');
    $pendingSum = $payments->where('status', 'pending')->sum('amount');
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

require __DIR__ . '/auth.php';

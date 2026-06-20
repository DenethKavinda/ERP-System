<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ErpPackageController;


// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function () {
    // Mock data mimicking an ERP database response
    $mockProducts = [
        ['id' => 1, 'name' => 'Premium Wireless Headphones', 'description' => 'Noise-canceling over-ear studio headphones.', 'price' => 199],
        ['id' => 2, 'name' => 'Ergonomic Office Chair', 'description' => 'High-back lumbar support mesh chair.', 'price' => 349],
    ];

    $mockServices = [
        ['id' => 1, 'title' => 'Device On-Site Installation', 'description' => 'Professional unboxing, configuration, and structural setup.', 'duration' => '1.5 Hours', 'rate' => 75],
        ['id' => 2, 'title' => 'Annual System Maintenance', 'description' => 'Full software diagnostic tuning and physical hardware inspection.', 'duration' => '2 Hours', 'rate' => 120],
    ];

    return Inertia::render('Users/Dashboard', [
        'products' => $mockProducts,
        'services' => $mockServices,
    ]);
});



// Main Dashboard (Fetches dynamic cards from the database)
Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

// ERP Portal Section Route
Route::get('/ERP', [ErpPackageController::class, 'index'])->name('erp.index');


// Simple Authentication Protected Management System Routes
// Since there's no role-based check, any logged-in user can reach these endpoints
// Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
Route::get('/dashboard-manager', [DashboardController::class, 'adminIndex'])->name('dashboard.manager');
Route::post('/dashboard-manager', [DashboardController::class, 'store'])->name('dashboard.store');
Route::delete('/dashboard-manager/{id}', [DashboardController::class, 'destroy'])->name('dashboard.destroy');

// Administrative Workspace Engine Routes (No auth role protection active yet)
Route::get('/erp-packages', [ErpPackageController::class, 'adminIndex'])->name('admin.packages.index');
Route::post('/erp-packages', [ErpPackageController::class, 'store'])->name('admin.packages.store');
// });

// Profile Management Routes
// Route::middleware('auth')->group(function () {
Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

require __DIR__ . '/auth.php';

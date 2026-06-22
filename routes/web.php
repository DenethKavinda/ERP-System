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

// Public Auth Action Layer endpoints 
Route::get('/', [AuthController::class, 'showLogin'])->name('login');
Route::post('/', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);


// Logout Session Endpoint
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// ==========================================
// 1. SHARED AUTHENTICATED ROUTES (All Logged-In Roles)
// ==========================================
Route::middleware(['auth', 'verified'])->group(function () {

    // User Workspace Interfaces
    Route::get('/dashboard-user', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/ERP', [ErpPackageController::class, 'index'])->name('erp.index');
    Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
    Route::get('/knowledge-center', [KnowledgeCenter::class, 'viewKnowledgeCenter'])->name('knowledge.center');

    Route::get('/complaints', [ComplaintController::class, 'create'])->name('complaints.create');
    Route::post('/complaints', [ComplaintController::class, 'store'])->name('complaints.store');
    Route::get('/complaints/download/{id}', [ComplaintController::class, 'downloadAttachment'])->name('complaints.download');

    // Profile Management (Accessible globally by both standard users and admins at /profile)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/// 2. PROTECTED ADMINISTRATIVE ROUTES (Admins Only)
// ==========================================
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    // Administrative Dashboard Control System
    // REMOVED '/admin' from the paths because ->prefix('admin') handles it automatically!
    Route::get('/dashboard-manager', [DashboardController::class, 'adminIndex'])->name('dashboard.manager');
    Route::post('/dashboard-manager', [DashboardController::class, 'store'])->name('dashboard.store');
    Route::delete('/dashboard-manager/{id}', [DashboardController::class, 'destroy'])->name('dashboard.destroy');
    Route::put('/dashboard-manager/{id}', [DashboardController::class, 'update'])->name('dashboard.update');

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
    Route::post('/complaints/{id}/reply', [ComplaintController::class, 'storeReply'])->name('admin.complaints.reply');
});

require __DIR__ . '/auth.php';

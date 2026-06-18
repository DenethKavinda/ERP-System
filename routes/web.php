<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/user/dashboard', function () {
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
require __DIR__ . '/auth.php';

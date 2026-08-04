<?php

namespace App\Http\Controllers;

use App\Models\DashboardCard;
use App\Models\PackageCart;
use App\Models\Service;
use Inertia\Inertia;

class landingController extends Controller
{
    public function index()
    {
        return Inertia::render('landingPage', [
            'navigationCards' => DashboardCard::all(),
            'packageCarts' => PackageCart::with('packages')->get(),
            'services' => Service::where('is_active', true)->get(),
            'flashPayment' => [
                'order_id' => session('payment_success_order_id'),
                'amount' => session('payment_success_amount'),
                'items' => session('payment_success_items'),
            ],
        ]);
    }
}

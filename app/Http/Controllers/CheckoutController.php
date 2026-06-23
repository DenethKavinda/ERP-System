<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class CheckoutController extends Controller
{
    /**
     * Initialize payment processing session parameters for PayHere Checkout loop.
     */
    public function initialize(Request $request)
    {
        $request->validate([
            'package_id' => 'required',
            'package_name' => 'required|string',
            'base_price' => 'required|numeric',
            'addon_ids' => 'nullable|array',
        ]);

        $orderId = 'ORD_' . uniqid();
        $totalAmount = (float) $request->base_price;

        if ($request->has('addon_ids') && !empty($request->addon_ids)) {
            $addons = Service::whereIn('id', $request->addon_ids)->get();
            foreach ($addons as $addon) {
                $totalAmount += (float) $addon->price;
            }
        }

        $merchantId = config('services.payhere.merchant_id', env('PAYHERE_MERCHANT_ID'));
        $appSecret = env('PAYHERE_SECRET');

        $hashedAmount = number_format($totalAmount, 2, '.', '');

        $appSecretHash = strtoupper(md5($appSecret));
        $payhereHash = strtoupper(md5($merchantId . $orderId . $hashedAmount . 'LKR' . $appSecretHash));

        $user = Auth::user();

        $paymentData = [
            'sandbox' => env('PAYHERE_IS_SANDBOX', true),
            'merchant_id' => $merchantId,

            // 🚀 REDIRECT UPGRADE: Routes directly into your newly configured callback route session layer
            'return_url' => route('checkout.success.callback'),
            'cancel_url' => url('/dashboard-user'),

            'notify_url' => url('/api/payhere/webhook'),
            'order_id' => $orderId,
            'items' => $request->package_name,
            'amount' => $hashedAmount,
            'currency' => 'LKR',
            'hash' => $payhereHash,
            'first_name' => $user ? $user->name : 'Guest',
            'last_name' => 'Customer',
            'email' => $user ? $user->email : 'customer@email.com',
            'phone' => '0771234567',
            'address' => 'No 10, Main Street',
            'city' => 'Colombo',
            'country' => 'Sri Lanka',
        ];

        return response()->json($paymentData);
    }

    /**
     * Compile transaction parameters and render a downloadable PDF Receipt stream.
     */
    public function downloadReceipt(Request $request)
    {
        // Capture total amount cleanly from front-end request parameters
        $totalPaid = (float) $request->get('total_amount', 0.00);
        $packageName = $request->get('package_name', 'Enterprise Module Stack');

        $data = [
            'order_id'       => $request->get('order_id', 'ORD_MOCK12345'),
            'customer_name'  => Auth::check() ? Auth::user()->name : 'Guest Customer',
            'customer_email' => Auth::check() ? Auth::user()->email : 'customer@email.com',
            'package_name'   => $packageName,
            'base_price'     => $totalPaid,
            'total_amount'   => $totalPaid,
            'addons'         => []
        ];

        $pdf = Pdf::loadView('receipt', $data);
        return $pdf->download('Receipt_' . $data['order_id'] . '.pdf');
    }
}

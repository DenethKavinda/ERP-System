<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service; // Reference to Service.php model
use App\Models\Payment; // Your database model tracking layer
use Illuminate\Support\Facades\Auth; // Pull the Auth Facade class hook
use Barryvdh\DomPDF\Facade\Pdf; // Pull the DOMPDF compiler facade string
use Carbon\Carbon; // 🕒 Handles local Sri Lankan times layout calculations

class CheckoutController extends Controller
{
    /**
     * Initialize payment processing session parameters for PayHere Checkout loop.
     * Logs split costs (Base plan vs Addons) into the database rows before hitting gateway.
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

        $basePrice = (float) $request->base_price;
        $addonsTotal = 0.00;
        $addonsManifestArray = [];

        // Eager load and loop over extra checked micro-services to calculate breakdowns
        if ($request->has('addon_ids') && !empty($request->addon_ids)) {
            $addons = Service::whereIn('id', $request->addon_ids)->get();
            foreach ($addons as $addon) {
                $addonsTotal += (float) $addon->price;
                $addonsManifestArray[] = [
                    'name' => $addon->name,
                    'price' => (float) $addon->price
                ];
            }
        }

        // Aggregate full dynamic grand total
        $totalAmount = $basePrice + $addonsTotal;

        $merchantId = config('services.payhere.merchant_id', env('PAYHERE_MERCHANT_ID'));
        $appSecret = env('PAYHERE_SECRET');

        // PayHere requires exactly 2 decimal places for the amount string in hash generation
        $hashedAmount = number_format($totalAmount, 2, '.', '');

        // Generates an uppercase MD5 sequence matching PayHere's sandbox validation pipeline
        $appSecretHash = strtoupper(md5($appSecret));
        $payhereHash = strtoupper(md5($merchantId . $orderId . $hashedAmount . 'LKR' . $appSecretHash));

        $user = Auth::user();

        // 🚀 DATABASE TRACKING: Save split pricing breakdown segments securely
        Payment::create([
            'order_id' => $orderId,
            'user_id' => $user ? $user->id : null,
            'package_name' => $request->package_name,
            'base_price' => $basePrice,
            'addons_total' => $addonsTotal,
            'addons_manifest' => $addonsManifestArray, // Casted automatically via your Eloquent Model array config
            'amount' => $totalAmount,
            'currency' => 'LKR',
            'status' => 'pending',
        ]);

        // Package all gateway payload details together
        $paymentData = [
            'sandbox' => env('PAYHERE_IS_SANDBOX', true),
            'merchant_id' => $merchantId,
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
     * Handle incoming asynchronous notifications from PayHere (Background Webhook handler)
     */
    public function handleWebhook(Request $request)
    {
        $merchantId = $request->get('merchant_id');
        $orderId = $request->get('order_id');
        $payhereAmount = $request->get('payhere_amount');
        $payhereCurrency = $request->get('payhere_currency');
        $statusCode = $request->get('status_code');
        $md5sig = $request->get('md5sig');

        $appSecret = env('PAYHERE_SECRET');

        // PayHere Webhook Verification Hash Code Equation Formula Sequence
        $localMd5sig = strtoupper(
            md5(
                $merchantId .
                    $orderId .
                    $payhereAmount .
                    $payhereCurrency .
                    $statusCode .
                    strtoupper(md5($appSecret))
            )
        );

        // Verify integrity of background payload signature context
        if ($localMd5sig === $md5sig) {
            $payment = Payment::where('order_id', $orderId)->first();

            if ($payment) {
                // status_code 2 indicates that the funds were cleared successfully by PayHere
                if ($statusCode == 2) {
                    $payment->update([
                        'status' => 'completed',
                        'payment_id' => $request->get('payment_id')
                    ]);
                } else {
                    $payment->update(['status' => 'failed']);
                }
            }
        }

        return response()->json(['status' => 'processed']);
    }

    /**
     * Compile transaction parameters and render a localized split itemization PDF.
     */
    public function downloadReceipt(Request $request)
    {
        $orderId = $request->get('order_id');

        // Search database rows directly for explicit architectural source of truth
        $payment = Payment::where('order_id', $orderId)->first();

        if (!$payment) {
            abort(404, "Transaction record not found inside server database logs.");
        }

        // Compile clean parameters array and parse timezone explicitly to Asia/Colombo (+5:30 GMT)
        $data = [
            'order_id'       => $payment->order_id,
            'date'           => Carbon::parse($payment->updated_at)->setTimezone('Asia/Colombo')->format('Y-m-d H:i:s'),
            'customer_name'  => Auth::check() ? Auth::user()->name : 'Valued Customer',
            'customer_email' => Auth::check() ? Auth::user()->email : 'customer@email.com',
            'package_name'   => $payment->package_name,
            'base_price'     => (float) $payment->base_price,
            'total_amount'   => (float) $payment->amount,
            'addons'         => $payment->addons_manifest ?? [] // Pulls down itemized sub-service rows cleanly
        ];

        // Load the view blade template layout context passing array metrics
        $pdf = Pdf::loadView('receipt', $data);

        // Force browser thread to initiate target download asset file sheet
        return $pdf->download('Receipt_' . $data['order_id'] . '.pdf');
    }
}

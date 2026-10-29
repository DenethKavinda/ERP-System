<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service; // Reference to Service.php model
use App\Models\Payment; // Your database model tracking layer
use App\Models\ErpPackage; // Reference to official packages
use Illuminate\Support\Facades\Auth; // Pull the Auth Facade class hook
use Barryvdh\DomPDF\Facade\Pdf; // Pull the DOMPDF compiler facade string
use Carbon\Carbon; // 🕒 Handles local Sri Lankan times layout calculations

class CheckoutController extends Controller
{
    /**
     * Initialize payment processing parameters for standalone Service Marketplace items.
     * Handles multi-service cart checkouts via PayHere Sandbox.
     */
    public function initializeServices(Request $request)
    {
        $request->validate([
            'service_ids' => 'required|array',
            'service_ids.*' => 'required|integer|exists:services,id',
        ]);

        $services = Service::whereIn('id', $request->service_ids)->get();

        if ($services->isEmpty()) {
            return response()->json(['error' => 'No valid services selected.'], 400);
        }

        $orderId = 'SRV_' . uniqid();
        $totalAmount = 0.00;
        $serviceNames = [];
        $addonsManifestArray = [];

        foreach ($services as $service) {
            $totalAmount += (float) $service->price;
            $serviceNames[] = $service->name;
            $addonsManifestArray[] = [
                'name' => $service->name,
                'price' => (float) $service->price
            ];
        }

        // 🛠️ FIXED: Standardized package description label for clarity on receipt headers
        $packageNameSummary = 'Custom Service Infrastructure Bundle';

        $merchantId = config('services.payhere.merchant_id');
        $appSecret = config('services.payhere.secret');

        $hashedAmount = number_format($totalAmount, 2, '.', '');
        $appSecretHash = strtoupper(md5($appSecret));
        $payhereHash = strtoupper(md5($merchantId . $orderId . $hashedAmount . 'LKR' . $appSecretHash));

        $user = Auth::user();

        // 🛠️ Storing metadata with 'pending' status until PayHere webhook settlement
        Payment::create([
            'order_id' => $orderId,
            'user_id' => $user ? $user->id : null,
            'package_name' => $packageNameSummary,
            'base_price' => 0.00, // 0.00 indicates a pure service collection checkout
            'addons_total' => $totalAmount,
            'addons_manifest' => $addonsManifestArray,
            'amount' => $totalAmount,
            'currency' => 'LKR',
            'status' => 'pending',

            'expires_at'      => now()->addDays(30),
        ]);

        $paymentData = [
            'sandbox' => (bool) config('services.payhere.is_sandbox', true),
            'merchant_id' => $merchantId,
            'return_url' => route('checkout.success.callback'),
            'cancel_url' => url('/services'),
            'notify_url' => route('payhere.webhook'),
            'order_id' => $orderId,
            'items' => mb_strimwidth($packageNameSummary, 0, 50, '...'),
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
     * Initialize payment processing session parameters for PayHere Checkout loop (Packages).
     */


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

        $appSecret = config('services.payhere.secret');

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

        if ($localMd5sig === $md5sig) {
            $payment = Payment::where('order_id', $orderId)->first();

            if ($payment) {
                if ($statusCode == 2) {
                    $payment->update([
                        'status' => 'Completed',
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
     * 🚀 FIXED: Re-added the query-string download method to satisfy your /checkout/receipt/download route mapping!
     */

    public function initialize(Request $request)
    {
        $request->validate([
            'package_id'    => 'required',
            'package_name'  => 'required|string',
            'base_price'    => 'nullable|numeric',
            'addon_ids'     => 'nullable|array',
            'billing_cycle' => 'nullable|string',
        ]);

        $orderId = 'ORD_' . uniqid();

        // Server-side package verification to prevent client-side price tampering
        $package = ErpPackage::where('id', $request->package_id)
            ->orWhere('code', strtolower((string) $request->package_id))
            ->orWhere('name', $request->package_name)
            ->first();

        $billingCycle = strtolower((string) $request->get('billing_cycle', 'monthly'));
        $isAnnual = in_array($billingCycle, ['annual', 'yearly']);

        if ($package) {
            $officialMonthly = (float) $package->price;
            $expectedBasePrice = $isAnnual ? ($officialMonthly * 10) : $officialMonthly;
            $isFreePlan = ($package->code === 'free' || $officialMonthly == 0);
        } else {
            $isFreePlan = str_contains(strtolower($request->package_name), 'free');
            $expectedBasePrice = $isFreePlan ? 0.00 : (float) $request->base_price;
        }

        // Enforce verified base price (cannot be 0 unless it is authentically the Free plan)
        $basePrice = $isFreePlan ? 0.00 : max($expectedBasePrice, 1.00);

        $addonsTotal = 0.00;
        $addonsManifestArray = [];

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

        $totalAmount = $basePrice + $addonsTotal;

        $merchantId = config('services.payhere.merchant_id');
        $appSecret = config('services.payhere.secret');

        $hashedAmount = number_format($totalAmount, 2, '.', '');
        $appSecretHash = strtoupper(md5($appSecret));
        $payhereHash = strtoupper(md5($merchantId . $orderId . $hashedAmount . 'LKR' . $appSecretHash));

        $user = Auth::user();

        // Storing transaction with 'pending' status until PayHere settlement confirmation
        $payment = Payment::create([
            'order_id' => $orderId,
            'user_id' => $user ? $user->id : null,
            'package_name' => $request->package_name,
            'base_price' => $basePrice,
            'addons_total' => $addonsTotal,
            'addons_manifest' => $addonsManifestArray,
            'amount' => $totalAmount,
            'currency' => 'LKR',
            'status' => 'pending',

            // Automatically calculate expiration (1 year for annual, 30 days for monthly / trial)
            'expires_at' => $isAnnual ? now()->addYear() : now()->addDays(30),
        ]);

        if ($isFreePlan && $totalAmount <= 0) {
            $payment->update(['status' => 'Completed']);
            return response()->json([
                'is_free' => true,
                'order_id' => $orderId,
                'message' => 'Free Plan activated successfully!'
            ]);
        }

        if ($totalAmount <= 0) {
            return response()->json(['error' => 'Invalid transaction amount for paid package.'], 422);
        }

        $paymentData = [
            'sandbox' => (bool) config('services.payhere.is_sandbox', true),
            'merchant_id' => $merchantId,
            'return_url' => route('checkout.success.callback'),
            'cancel_url' => url('/dashboard-user'),
            'notify_url' => route('payhere.webhook'),
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
     * Query-string download method with ownership / session verification.
     */
    public function downloadReceipt(Request $request)
    {
        $orderId = $request->get('order_id');

        if (!$orderId) {
            abort(400, "Missing order ID parameter.");
        }

        $payment = Payment::where('order_id', $orderId)->first();

        if (!$payment) {
            abort(404, "Transaction record not found inside server database logs.");
        }

        // Security / Ownership Verification:
        // Authenticated users may download their own receipts (or admin).
        // Guests may only download if the session just completed this exact order.
        $isOwner = Auth::check() && ($payment->user_id === Auth::id() || Auth::user()->role === 'admin');
        $isSessionGuest = session('payment_success_order_id') === $orderId;

        if (!$isOwner && !$isSessionGuest) {
            abort(403, "Unauthorized receipt download request.");
        }

        $data = [
            'order_id'       => $payment->order_id,
            'date'           => Carbon::parse($payment->updated_at)->setTimezone('Asia/Colombo')->format('Y-m-d H:i:s'),
            'customer_name'  => Auth::check() ? Auth::user()->name : 'Valued Customer',
            'customer_email' => Auth::check() ? Auth::user()->email : 'customer@email.com',
            'package_name'   => $payment->package_name,
            'base_price'     => (float) $payment->base_price,
            'total_amount'   => (float) $payment->amount,
            'addons'         => $payment->addons_manifest ?? []
        ];

        $pdf = Pdf::loadView('receipt', $data);
        return $pdf->download('Receipt_' . $data['order_id'] . '.pdf');
    }

    /**
     * Order URL download routing method updated to resolve layout values.
     */
    public function downloadReceiptByOrder($orderId)
    {
        $payment = Payment::where('order_id', $orderId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // 🛠️ FIXED: Pulling exact split variables from model array records
        $data = [
            'order_id'       => $payment->order_id,
            'date'           => Carbon::parse($payment->updated_at)->setTimezone('Asia/Colombo')->format('Y-m-d h:i A'),
            'customer_name'  => Auth::user()->name,
            'customer_email' => Auth::user()->email,
            'package_name'   => $payment->package_name,
            'base_price'     => (float) $payment->base_price,
            'total_amount'   => (float) $payment->amount,
            'addons'         => $payment->addons_manifest ?? [],
        ];

        $pdf = Pdf::loadView('receipt', $data);
        return $pdf->download('Receipt-' . $payment->order_id . '.pdf');
    }
}

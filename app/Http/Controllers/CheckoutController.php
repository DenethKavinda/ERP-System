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
                // Verify currency & amount matches expected payment
                $paidAmount = (float)$payhereAmount;
                $expectedAmount = (float)$payment->amount;

                if ($statusCode == 2) {
                    if ($payhereCurrency !== $payment->currency || $paidAmount < $expectedAmount) {
                        \Illuminate\Support\Facades\Log::warning("PayHere amount/currency mismatch for order {$orderId}: paid {$payhereCurrency} {$paidAmount}, expected {$payment->currency} {$expectedAmount}");
                        $payment->update(['status' => 'failed']);
                        return response()->json(['status' => 'amount_mismatch'], 400);
                    }

                    $manifest = is_array($payment->addons_manifest) ? $payment->addons_manifest : [];
                    $cycle = $manifest['billing_cycle'] ?? 'monthly';
                    $expiresAt = $cycle === 'annual' ? now()->addYear() : now()->addDays(30);

                    $payment->update([
                        'status'     => 'Completed',
                        'payment_id' => $request->get('payment_id'),
                        'expires_at' => $expiresAt,
                    ]);

                    // Sync to ERP Backend ONLY if this is a plan subscription order (NEVER sync standalone service orders)
                    if ($payment->isPlanSubscription() && $payment->user && function_exists('syncErpSubscriptionToBackend')) {
                        $synced = syncErpSubscriptionToBackend(
                            $payment->user->email,
                            $payment->package_name,
                            'active',
                            $expiresAt->toIso8601String(),
                            'update',
                            $cycle
                        );

                        $manifest['erp_sync'] = [
                            'status'    => $synced ? 'synced' : 'failed',
                            'synced_at' => now()->toIso8601String(),
                        ];
                        $payment->update(['addons_manifest' => $manifest]);
                    }
                } elseif ((int)$statusCode === 0) {
                    // 0 = Pending in PayHere
                    $payment->update(['status' => 'pending']);
                } else {
                    // Negative numbers (-1 Canceled, -2 Failed, -3 Chargedback)
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
            'package_name'  => 'nullable|string',
            'base_price'    => 'nullable|numeric',
            'addon_ids'     => 'nullable|array',
            'billing_cycle' => 'nullable|string',
        ]);

        $orderId = 'ORD_' . uniqid();

        // Resolve package strictly from database — never trust client-submitted pricing
        $package = null;
        if (is_numeric($request->package_id)) {
            $package = ErpPackage::find($request->package_id);
        }
        if (!$package && is_string($request->package_id)) {
            $package = ErpPackage::where('code', strtolower(trim($request->package_id)))->first();
        }
        if (!$package && $request->filled('package_name')) {
            $cleanName = preg_replace('/\s*\((Monthly|Yearly|Annual|Annual Prepay)\)/i', '', $request->package_name);
            $package = ErpPackage::where('name', trim($cleanName))
                ->orWhere('code', strtolower(trim($cleanName)))
                ->first();
        }

        if (!$package) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or unrecognized ERP package selected.'
            ], 422);
        }

        $billingCycle = strtolower((string) $request->get('billing_cycle', 'monthly'));
        $isAnnual = in_array($billingCycle, ['annual', 'yearly']);

        // Derive package name authoritatively from the database record
        $packageName = $package->name . ($isAnnual ? ' (Annual Prepay)' : ' (Monthly)');

        $officialMonthly = (float) $package->price;
        $isFreePlan = ($package->code === 'free' || $officialMonthly == 0);

        if ($isFreePlan) {
            $basePrice = 0.00;
        } else {
            $basePrice = $isAnnual ? round($officialMonthly * 10, 2) : $officialMonthly;
        }

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
            'order_id'        => $orderId,
            'user_id'         => $user ? $user->id : null,
            'package_name'    => $packageName,
            'base_price'      => $basePrice,
            'addons_total'    => $addonsTotal,
            'addons_manifest' => [
                'items'         => $addonsManifestArray,
                'billing_cycle' => $isAnnual ? 'annual' : 'monthly',
                'package_code'  => $package->code,
            ],
            'amount'          => $totalAmount,
            'currency'        => 'LKR',
            'status'          => 'pending',

            // Automatically calculate expiration (1 year for annual, 30 days for monthly / trial)
            'expires_at'      => $isAnnual ? now()->addYear() : now()->addDays(30),
        ]);

        if ($isFreePlan && $totalAmount <= 0) {
            $payment->update([
                'status'     => 'Completed',
                'expires_at' => now()->addDays($package->trial_days ?: 30),
            ]);
            return response()->json([
                'is_free'      => true,
                'order_id'     => $orderId,
                'redirect_url' => route('dashboard'),
                'message'      => 'Free Plan activated successfully!'
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
            'items' => $packageName,
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

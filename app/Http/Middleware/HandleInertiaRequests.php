<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $isSubscriptionActive = false;

        if ($user) {
            if ($user->role === 'admin') {
                $isSubscriptionActive = true;
            } else {
                $latestPayment = \App\Models\Payment::latestPlanForUser($user->id);
                $isSubscriptionActive = (bool)(
                    $latestPayment 
                    && in_array(strtolower((string)$latestPayment->status), ['completed', 'active']) 
                    && $latestPayment->expires_at 
                    && $latestPayment->expires_at->isFuture()
                );
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'isSubscriptionActive' => $isSubscriptionActive,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
            'erpAppUrl' => config('services.erp.app_url', 'http://localhost:5173'),
        ];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'user_id',
        'package_name',
        'base_price',      // 🚀 Added
        'addons_total',    // 🚀 Added
        'addons_manifest', // 🚀 Added
        'amount',
        'currency',
        'status',
        'payment_id',
        'expires_at', // 🚀 ADD THIS LINE
    ];

    // Automatically converts database text rows into working arrays code workflows
    protected $casts = [
        'addons_manifest' => 'array',
        'expires_at' => 'datetime', // 🚀 ADD THIS LINE
    ];

    /**
     * Get the user that owns the payment transaction node.
     * 🚀 FIXED: Resolves the 500 internal server error during Eager Loading
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope query to plan subscription orders only (excludes standalone service bundles).
     */
    public function scopePlanSubscriptions($query)
    {
        return $query->where('order_id', 'not like', 'SRV_%')
                     ->where('package_name', '!=', 'Custom Service Infrastructure Bundle');
    }

    /**
     * Scope query to active/completed plan records.
     */
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['Completed', 'completed', 'active', 'Active'])
                     ->where('expires_at', '>', now());
    }

    /**
     * Scope query to completed or active plan records regardless of expiry date.
     */
    public function scopeCompletedOrActive($query)
    {
        return $query->whereIn('status', ['Completed', 'completed', 'active', 'Active']);
    }

    /**
     * Determine if this transaction represents an ERP plan subscription.
     */
    public function isPlanSubscription(): bool
    {
        return !str_starts_with((string)$this->order_id, 'SRV_') 
            && $this->package_name !== 'Custom Service Infrastructure Bundle';
    }

    /**
     * Retrieve the latest active (paid and unexpired) plan subscription for a user.
     */
    public static function latestActivePlanForUser($userId)
    {
        return static::where('user_id', $userId)
            ->planSubscriptions()
            ->active()
            ->latest('expires_at')
            ->first();
    }

    /**
     * Retrieve the latest completed/paid plan subscription for a user.
     */
    public static function latestCompletedOrActivePlanForUser($userId)
    {
        return static::where('user_id', $userId)
            ->planSubscriptions()
            ->completedOrActive()
            ->latest()
            ->first();
    }

    /**
     * Retrieve the plan subscription payment for a given user.
     * Prioritizes paid/completed plan records over unpaid pending/failed attempts.
     */
    public static function latestPlanForUser($userId, bool $requirePaid = false)
    {
        if ($requirePaid) {
            return static::latestCompletedOrActivePlanForUser($userId);
        }

        $paid = static::latestCompletedOrActivePlanForUser($userId);
        if ($paid) {
            return $paid;
        }

        return static::where('user_id', $userId)
            ->planSubscriptions()
            ->latest()
            ->first();
    }
}

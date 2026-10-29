<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ErpPackage extends Model
{
    protected $fillable = [
        'name',
        'code',
        'price',
        'suitable_for',
        'features',
        'benefits',
        'rating',
        'youtube_id',
        'max_branches',
        'max_warehouses',
        'max_users',
        'max_products',
        'max_monthly_bills',
        'is_popular',
        'trial_days',
        'inherited_from',
        'badge_text',
        'status',
        'modules',
        'sort_order',
    ];

    protected $casts = [
        'is_popular' => 'boolean',
        'max_branches' => 'integer',
        'max_warehouses' => 'integer',
        'max_users' => 'integer',
        'max_products' => 'integer',
        'max_monthly_bills' => 'integer',
        'trial_days' => 'integer',
        'sort_order' => 'integer',
        'modules' => 'array',
    ];

    protected $appends = ['annual_price'];

    public function getAnnualPriceAttribute(): float
    {
        return round(((float) ($this->attributes['price'] ?? 0)) * 10, 2);
    }
}

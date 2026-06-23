<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Package extends Model
{
    protected $fillable = [
        'package_cart_id',
        'youtube_link',
        'main_topic',
        'small_description',
        'package_name',
        'price',
        'suitable_business',
        'core_features',
        'benefits',
        'rating',
    ];

    /**
     * Get the parent cart box layout.
     */
    public function cart(): BelongsTo
    {
        return $this->belongsTo(PackageCart::class, 'package_cart_id');
    }
}

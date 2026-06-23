<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PackageCart extends Model
{
    protected $fillable = [
        'cart_name',
        'button_name',
        'description',
        'color_class',
    ];

    /**
     * Get all packages belonging to this specific Cart.
     */
    public function packages(): HasMany
    {
        return $this->hasMany(Package::class, 'package_cart_id');
    }
}

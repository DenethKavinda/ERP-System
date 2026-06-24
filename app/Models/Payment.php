<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    ];

    // Automatically converts database text rows into working arrays code workflows
    protected $casts = [
        'addons_manifest' => 'array',
    ];
}

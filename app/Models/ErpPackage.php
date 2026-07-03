<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ErpPackage extends Model
{
    protected $fillable = [
        'name',
        'price',
        'suitable_for',
        'features',
        'benefits',
        'rating',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DashboardCard extends Model
{
    protected $fillable = [
        'name',
        'path',
        'button_text',
        'description',
        'accent_color',
    ];
}

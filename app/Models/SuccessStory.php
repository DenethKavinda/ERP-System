<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuccessStory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'item_type',
        'item_name',
        'feedback',
        'rating',
        'is_approved',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'rating'      => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

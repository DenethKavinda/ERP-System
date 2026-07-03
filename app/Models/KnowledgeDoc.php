<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class KnowledgeDoc extends Model
{
    protected $fillable = ['slug', 'title', 'category', 'type', 'description', 'file_url'];

    protected static function boot()
    {
        parent::boot();
        // Generate static slug strings automatically if not defined
        static::creating(function ($doc) {
            if (empty($doc->slug)) {
                $doc->slug = Str::slug($doc->title) . '-' . rand(100, 999);
            }
        });
    }
}

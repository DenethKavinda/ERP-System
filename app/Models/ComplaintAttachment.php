<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComplaintAttachment extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     * Laravel will automatically guess 'complaint_attachments', 
     * but defining it explicitly prevents any structural mismatch.
     */
    protected $table = 'complaint_attachments';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'complaint_id',
        'file_path',
        'original_name'
    ];

    /**
     * Get the complaint ticket that owns this attachment asset.
     */
    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }
}

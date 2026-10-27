<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'business_name',
        'email',
        'password',
        'nic',
        'address',
        'mobile_number',
        'role',
        'customer_id',
    ];

    /**
     * Auto-generate a unique Customer ID on creation.
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($user) {
            if (empty($user->customer_id)) {
                $user->customer_id = 'NXS-' . str_pad($user->id, 5, '0', STR_PAD_LEFT);
                $user->saveQuietly();
            }
        });
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function complaints(): HasMany
    {
        return $this->hasMany(Complaint::class);
    }

    public function successStories()
    {
        return $this->hasMany(SuccessStory::class);
    }
}

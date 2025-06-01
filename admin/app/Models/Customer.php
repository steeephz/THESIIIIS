<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'customer_type',
        'account_number',
        'address',
        'contact_number',
        'meter_number'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 
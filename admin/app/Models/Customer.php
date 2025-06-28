<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $table = 'customers_tb';

    protected $fillable = [
        'first_name',
        'last_name',
        'full_name',
        'username',
        'password',
        'customer_type',
        'address',
        'phone_number',
        'email',
        'account_number',
        'meter_number'
    ];

    protected $hidden = [
        'password',
    ];

    // Relationship with meter readings
    public function meterReadings()
    {
        return $this->hasMany(MeterReading::class, 'customer_id');
    }
} 
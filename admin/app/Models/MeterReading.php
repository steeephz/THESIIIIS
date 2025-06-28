<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeterReading extends Model
{
    use HasFactory;

    protected $table = 'meter_readings';

    protected $fillable = [
        'customer_id',
        'meter_number',
        'reading_date',
        'previous_reading',
        'current_reading',
        'consumption',
        'rate_id',
        'amount',
        'status',
        'remarks'
    ];

    protected $casts = [
        'reading_date' => 'date',
        'previous_reading' => 'integer',
        'current_reading' => 'integer',
        'consumption' => 'integer',
        'amount' => 'decimal:2',
    ];

    // Relationship with Customer
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    // Relationship with Invoices
    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'reading_id');
    }
} 
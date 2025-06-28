<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillingCycle extends Model
{
    use HasFactory;

    protected $table = 'billing_cycles_tb';

    protected $fillable = [
        'customer',
        'account_number',
        'current_reading',
        'previous_reading',
        'amount_due',
        'due_date',
        'status',
        'account_type',
        'billing_period',
        'cycle_date',
        'meter_reading_date',
        'consumption',
        'rate',
        'total_amount',
        'bill_generated',
        'payment_status',
        'remarks',
    ];

    protected $casts = [
        'due_date' => 'date',
        'cycle_date' => 'date',
        'meter_reading_date' => 'date',
        'bill_generated' => 'date',
        'amount_due' => 'decimal:2',
        'rate' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'current_reading' => 'integer',
        'previous_reading' => 'integer',
        'consumption' => 'integer',
    ];

    // Relationship to customer (if needed for future use)
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'account_number', 'account_number');
    }
} 
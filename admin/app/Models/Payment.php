<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'customer_id',
        'bill_id',
        'amount',
        'payment_type',
        'payment_method',
        'proof_of_payment',
        'status',
        'remaining_balance',
        'account_number',
        'meter_number',
        'approved_at'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'remaining_balance' => 'decimal:2',
        'approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that made the payment
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the customer associated with the payment
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the bill associated with the payment
     */
    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }

    /**
     * Verify if the payment details match the customer records
     */
    public function verifyCustomerDetails(): bool
    {
        if (!$this->customer) {
            return false;
        }

        return $this->account_number === $this->customer->account_number &&
               $this->meter_number === $this->customer->meter_number;
    }
} 
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillPaymentValidation extends Model
{
    use HasFactory;

    protected $table = 'bill_payment_validation_tb';

    protected $fillable = [
        'customer',
        'account_number',
        'amount',
        'status',
        'account_type',
        'period',
        'payment_date',
        'payment_method',
        'reference',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
} 
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('bill_id')->constrained('bills')->onDelete('cascade');
            $table->string('payment_number')->unique();
            $table->decimal('amount', 10, 2);
            $table->enum('payment_type', ['Full', 'Partial']);
            $table->enum('payment_method', ['Cash', 'GCash', 'Bank_Transfer', 'Credit_Card', 'Other']);
            $table->string('proof_of_payment')->nullable();
            $table->string('account_number');
            $table->string('meter_number');
            $table->text('remarks')->nullable();
            $table->enum('status', ['Pending', 'Approved', 'Rejected', 'Verification_Failed'])->default('Pending');
            $table->decimal('remaining_balance', 10, 2)->default(0);
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();

            // Add indexes for better performance
            $table->index(['customer_id', 'status']);
            $table->index(['account_number', 'meter_number']);
            $table->index('payment_number');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
}; 
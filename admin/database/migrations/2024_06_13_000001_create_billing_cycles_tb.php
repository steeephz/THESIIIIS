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
        Schema::create('billing_cycles_tb', function (Blueprint $table) {
            $table->id();
            $table->string('customer', 255);
            $table->string('account_number', 50);
            $table->integer('current_reading');
            $table->integer('previous_reading');
            $table->decimal('amount_due', 10, 2);
            $table->date('due_date');
            $table->string('status', 30);
            // Details fields
            $table->string('account_type', 50)->nullable();
            $table->string('billing_period', 20)->nullable();
            $table->date('cycle_date')->nullable();
            $table->date('meter_reading_date')->nullable();
            $table->integer('consumption')->nullable();
            $table->decimal('rate', 10, 2)->nullable();
            $table->decimal('total_amount', 10, 2)->nullable();
            $table->date('bill_generated')->nullable();
            $table->string('payment_status', 30)->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billing_cycles_tb');
    }
}; 
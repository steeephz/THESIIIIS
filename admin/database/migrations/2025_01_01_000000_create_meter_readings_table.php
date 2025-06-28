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
        Schema::create('meter_readings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->string('meter_number', 50);
            $table->date('reading_date');
            $table->integer('previous_reading')->default(0);
            $table->integer('current_reading')->default(0);
            $table->integer('consumption')->default(0);
            $table->unsignedBigInteger('rate_id')->nullable();
            $table->decimal('amount', 10, 2)->default(0);
            $table->enum('status', ['Recorded', 'Invoiced', 'Corrected'])->default('Recorded');
            $table->text('remarks')->nullable();
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('customer_id')->references('id')->on('customers_tb')->onDelete('cascade');
            $table->foreign('rate_id')->references('id')->on('rates_tb')->onDelete('set null');
            
            // Indexes
            $table->index('customer_id');
            $table->index('meter_number');
            $table->index('reading_date');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meter_readings');
    }
}; 
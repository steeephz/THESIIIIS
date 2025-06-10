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
        Schema::create('rates_tb', function (Blueprint $table) {
            $table->id();
            $table->string('customer_type');
            $table->decimal('minimum_charge', 10, 2);
            $table->decimal('rate_per_cu_m', 10, 2);
            $table->date('effective_datec');
            $table->enum('status', ['active', 'inactive']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rates_tb');
    }
};

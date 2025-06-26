<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bills_tb', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id'); // Foreign key to customers_tb
            $table->decimal('total_amount', 10, 2);
            $table->decimal('remaining_balance', 10, 2)->nullable();
            $table->date('billing_date');
            $table->date('due_date');
            $table->integer('previous_reading');
            $table->integer('current_reading');
            $table->integer('consumption');
            $table->decimal('rate_amount', 10, 2);
            $table->string('status'); // e.g., Paid, Unpaid, Overdue
            $table->timestamps();

            $table->foreign('customer_id')->references('id')->on('customers_tb')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bills_tb');
    }
};

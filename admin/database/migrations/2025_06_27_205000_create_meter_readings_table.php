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
        Schema::create('meter_readings', function (Blueprint $table) {
            $table->id();
            $table->string('meter_number');
            $table->decimal('reading_value', 10, 2);
            $table->decimal('amount', 10, 2);
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('staff_id');
            $table->timestamp('reading_date');
            $table->timestamps();

            // Add foreign key constraints
            $table->foreign('staff_id')->references('id')->on('staff_tb')->onDelete('cascade');
            $table->index('meter_number');
            $table->index('staff_id');
            $table->index('reading_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('meter_readings');
    }
}; 
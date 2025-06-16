<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('ticket_remarks_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ticket_id');
            $table->text('remarks');
            $table->string('user');
            $table->timestamps();

            $table->foreign('ticket_id')
                  ->references('ticket_id')
                  ->on('tickets_tb')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('ticket_remarks_history');
    }
}; 
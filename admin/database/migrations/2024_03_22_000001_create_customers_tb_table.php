<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customers_tb', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username')->unique();
            $table->string('password');
            $table->enum('customer_type', ['residential', 'commercial', 'government']);
            $table->string('address');
            $table->string('contact_number');
            $table->string('email')->unique();
            $table->string('account_number')->unique();
            $table->string('meter_number', 9)->unique();
            $table->timestamps();
        });

        // Insert initial customer data
        DB::table('customers_tb')->insert([
            'name' => 'Gian Carlo S. Victorino',
            'username' => 'giancarlo',
            'password' => Hash::make('giancarlo123!'),
            'customer_type' => 'residential',
            'address' => '10 Harvard Street',
            'contact_number' => '09089896733',
            'email' => 'giancarlosvictorino@gmail.com',
            'account_number' => '11-111111',
            'meter_number' => '111111111',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers_tb');
    }
}; 
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop and recreate admin table
        Schema::dropIfExists('admin');
        
        Schema::create('admin', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->timestamps();
        });

        // Insert admin users with freshly hashed passwords
        DB::table('admin')->insert([
            [
                'username' => 'zayn',
                'password' => Hash::make('2025'),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'username' => 'cielo',
                'password' => Hash::make('ganda'),
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin');
    }
}; 
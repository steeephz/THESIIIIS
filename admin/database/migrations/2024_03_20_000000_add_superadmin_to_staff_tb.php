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
        // Clear existing data in staff_tb
        DB::table('staff_tb')->truncate();

        // Insert superadmin account
        DB::table('staff_tb')->insert([
            'name' => 'Super Admin',
            'username' => 'superadmin',
            'password' => Hash::make('superadmin'),
            'role' => 'superadmin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('staff_tb')->where('username', 'superadmin')->delete();
    }
}; 
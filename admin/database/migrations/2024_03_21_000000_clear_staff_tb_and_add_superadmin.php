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
            [
                'username' => 'superadmin',
                'password' => Hash::make('superadmin123!'),
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
        // If you want to revert, you can insert the previous accounts back
        // For now, we will just leave it empty
    }
}; 
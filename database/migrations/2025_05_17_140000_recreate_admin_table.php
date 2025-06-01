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
        // Create a temporary table to store existing admin data
        Schema::create('staff_temp', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->timestamps();
        });

        // Copy existing data if old table exists
        if (Schema::hasTable('staff_tb')) {
            DB::statement('INSERT INTO staff_temp (username, password) SELECT username, password FROM staff_tb');
            Schema::drop('staff_tb');
        }

        // Create new staff table with proper structure
        Schema::create('staff_tb', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->timestamps();
        });

        // Insert default staff users with hashed passwords if no existing data
        $staffCount = DB::table('staff_temp')->count();
        if ($staffCount === 0) {
            DB::table('staff_tb')->insert([
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
        } else {
            // Migrate existing users with hashed passwords
            $staff = DB::table('staff_temp')->get();
            foreach ($staff as $staffMember) {
                DB::table('staff_tb')->insert([
                    'username' => $staffMember->username,
                    'password' => Hash::make($staffMember->password), // Hash the plain text password
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }

        // Clean up
        Schema::drop('staff_temp');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff_tb');
    }
}; 
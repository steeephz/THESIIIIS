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
        Schema::create('admin_temp', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->timestamps();
        });

        // Copy existing data if old table exists
        if (Schema::hasTable('admin')) {
            DB::statement('INSERT INTO admin_temp (username, password) SELECT username, password FROM admin');
            Schema::drop('admin');
        }

        // Create new admin table with proper structure
        Schema::create('admin', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->timestamps();
        });

        // Insert default admin users with hashed passwords if no existing data
        $adminCount = DB::table('admin_temp')->count();
        if ($adminCount === 0) {
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
        } else {
            // Migrate existing users with hashed passwords
            $admins = DB::table('admin_temp')->get();
            foreach ($admins as $admin) {
                DB::table('admin')->insert([
                    'username' => $admin->username,
                    'password' => Hash::make($admin->password), // Hash the plain text password
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }

        // Clean up
        Schema::drop('admin_temp');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin');
    }
}; 
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Create a temporary table to store existing admin data
        Schema::create('admin_temp', function (Blueprint $table) {
            $table->id();
            $table->string('username');
            $table->string('password');
            $table->string('role')->nullable();
            $table->string('address')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
            $table->string('profile_picture')->nullable();
            $table->timestamps();
        });

        // Copy existing data if old table exists
        if (Schema::hasTable('admin')) {
            DB::statement('INSERT INTO admin_temp SELECT * FROM admin');
            Schema::drop('admin');
        }

        // Create new admin table with proper structure
        Schema::create('admin', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('username')->unique();
            $table->string('password');
            $table->string('role')->default('admin');
            $table->string('address')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
            $table->string('profile_picture')->nullable();
            $table->timestamps();
        });

        // Migrate data from temp table to new structure
        $admins = DB::table('admin_temp')->get();
        foreach ($admins as $admin) {
            // Create user record
            $userId = DB::table('users')->insertGetId([
                'name' => $admin->username,
                'email' => $admin->email ?? $admin->username . '@admin.com',
                'password' => $admin->password,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // Create admin record
            DB::table('admin')->insert([
                'user_id' => $userId,
                'username' => $admin->username,
                'password' => $admin->password,
                'role' => $admin->role ?? 'admin',
                'address' => $admin->address,
                'contact_number' => $admin->contact_number,
                'email' => $admin->email,
                'profile_picture' => $admin->profile_picture,
                'created_at' => $admin->created_at,
                'updated_at' => $admin->updated_at
            ]);
        }

        // Clean up
        Schema::drop('admin_temp');
    }

    public function down(): void
    {
        Schema::dropIfExists('admin');
    }
}; 
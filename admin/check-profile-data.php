<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    echo "=== Current Staff Records ===\n";
    $staff = DB::table('staff_tb')->orderBy('id')->get();
    
    foreach ($staff as $member) {
        echo "\n--- Staff ID: {$member->id} ---\n";
        echo "Name: " . ($member->name ?? 'N/A') . "\n";
        echo "Username: " . ($member->username ?? 'N/A') . "\n";
        echo "Role: " . ($member->role ?? 'N/A') . "\n";
        echo "Address: " . ($member->address ?? 'N/A') . "\n";
        echo "Contact: " . ($member->contact_number ?? 'N/A') . "\n";
        echo "Email: " . ($member->email ?? 'N/A') . "\n";
        echo "Profile Picture: " . ($member->profile_picture ?? 'N/A') . "\n";
        echo "Last Updated: " . ($member->updated_at ?? 'N/A') . "\n";
        
        if ($member->role === 'admin') {
            echo ">>> This is an ADMIN record <<<\n";
        }
    }
    
    echo "\n=== Testing Profile Update for Admin ===\n";
    $admin = DB::table('staff_tb')->where('role', 'admin')->first();
    
    if ($admin) {
        echo "Found admin: {$admin->name} (ID: {$admin->id})\n";
        
        // Test updating admin profile
        $updateResult = DB::table('staff_tb')
            ->where('id', $admin->id)
            ->update([
                'address' => 'Updated Address - ' . date('Y-m-d H:i:s'),
                'updated_at' => now()
            ]);
            
        echo "Update result: " . ($updateResult ? 'SUCCESS' : 'FAILED') . "\n";
        
        // Check the updated data
        $updatedAdmin = DB::table('staff_tb')->where('id', $admin->id)->first();
        echo "New address: " . $updatedAdmin->address . "\n";
        echo "New updated_at: " . $updatedAdmin->updated_at . "\n";
    } else {
        echo "No admin found in staff_tb table!\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
} 
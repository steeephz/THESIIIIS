<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    // Check if staff_tb table exists and has data
    echo "=== Staff Table Test ===\n";
    $staff = DB::table('staff_tb')->get();
    echo "Found " . $staff->count() . " staff records\n\n";
    
    if ($staff->count() > 0) {
        $firstStaff = $staff->first();
        echo "First staff record:\n";
        echo "ID: " . $firstStaff->id . "\n";
        echo "Name: " . $firstStaff->name . "\n";
        echo "Username: " . ($firstStaff->username ?? 'N/A') . "\n";
        echo "Address: " . ($firstStaff->address ?? 'N/A') . "\n";
        echo "Contact: " . ($firstStaff->contact_number ?? 'N/A') . "\n";
        echo "Email: " . ($firstStaff->email ?? 'N/A') . "\n";
        echo "Role: " . ($firstStaff->role ?? 'N/A') . "\n";
        echo "Profile Picture: " . ($firstStaff->profile_picture ?? 'N/A') . "\n";
        echo "Created: " . ($firstStaff->created_at ?? 'N/A') . "\n";
        echo "Updated: " . ($firstStaff->updated_at ?? 'N/A') . "\n\n";
        
        // Test update
        echo "=== Testing Update ===\n";
        $testUpdate = DB::table('staff_tb')
            ->where('id', $firstStaff->id)
            ->update([
                'updated_at' => now(),
                'address' => 'Test Address Update - ' . date('Y-m-d H:i:s')
            ]);
        
        echo "Update result: " . ($testUpdate ? 'Success' : 'Failed') . "\n";
        
        // Check if update worked
        $updatedStaff = DB::table('staff_tb')->where('id', $firstStaff->id)->first();
        echo "New address: " . $updatedStaff->address . "\n";
        echo "New updated_at: " . $updatedStaff->updated_at . "\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
} 
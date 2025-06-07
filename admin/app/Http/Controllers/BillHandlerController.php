<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class BillHandlerController extends Controller
{
    public function BillHandlerDashboard()
    {
        try {
            $user = Auth::user();
            
            // Debug log
            Log::info('Auth user:', ['user' => $user]);

            $staff = DB::table('staff_tb')
                ->where('username', $user->name)
                ->first();

            // Debug log
            Log::info('Staff data:', ['staff' => $staff]);

            if (!$staff) {
                Log::error('Staff not found for user: ' . $user->name);
                return response()->json([
                    'success' => false,
                    'message' => 'Staff record not found'
                ], 404);
            }

            if ($staff->role !== 'bill handler') {
                Log::error('Unauthorized role access attempt: ' . $staff->role);
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access'
                ], 403);
            }

            // Return only staff information
            return response()->json([
                'success' => true,
                'data' => [
                    'staff' => [
                        'name' => $staff->name,
                        'email' => $staff->email,
                        'role' => $staff->role
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Bill handler dashboard error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getCustomers()
    {
        try {
            $customers = DB::table('customers_tb')
                ->select('id', 'name', 'account_number', 'customer_type', 'email', 'contact_number')
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $customers
            ]);

        } catch (\Exception $e) {
            Log::error('Get customers error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching customers'
            ], 500);
        }
    }
} 
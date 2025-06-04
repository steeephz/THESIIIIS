<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Customer;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AccountController extends Controller
{
    public function createStaffAccount(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:staff_tb',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,meter handler,bill handler',
            'address' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'email' => 'required|email|max:255'
        ]);

        try {
            $staff = DB::table('staff_tb')->insert([
                'name' => $request->name,
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'address' => $request->address,
                'contact_number' => $request->contact_number,
                'email' => $request->email,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Staff account created successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create staff account: ' . $e->getMessage()
            ], 500);
        }
    }

    public function createCustomerAccount(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'customer_type' => 'required|in:residential,commercial,government',
                'account_number' => 'required|string|unique:customers',
                'address' => 'required|string',
                'contact_number' => 'required|string',
                'meter_number' => 'required|string|unique:customers'
            ]);

            DB::beginTransaction();

            // Create user record
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);

            // Create customer record
            $customer = Customer::create([
                'user_id' => $user->id,
                'customer_type' => $request->customer_type,
                'account_number' => $request->account_number,
                'address' => $request->address,
                'contact_number' => $request->contact_number,
                'meter_number' => $request->meter_number
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Customer account created successfully',
                'data' => [
                    'user' => $user,
                    'customer' => $customer
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Customer account creation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create customer account: ' . $e->getMessage()
            ], 500);
        }
    }

    public function listAccounts(Request $request)
    {
        try {
            $type = $request->query('type', 'all');
            $search = $request->query('search', '');

            Log::info('Fetching accounts', ['type' => $type, 'search' => $search]);

            // Query for staff accounts
            $query = DB::table('staff_tb');

            // Add search conditions if search term exists
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('username', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Filter by role if not 'all'
            if ($type !== 'all' && $type !== 'customer') {
                $query->where('role', $type);
            }

            // Get all staff accounts
            $staffAccounts = $query->get();

            Log::info('Staff accounts found', ['count' => $staffAccounts->count()]);

            // Format the response
            $formattedAccounts = $staffAccounts->map(function($staff) {
                return [
                    'id' => $staff->id,
                    'name' => $staff->name,
                    'username' => $staff->username,
                    'email' => $staff->email,
                    'role' => $staff->role,
                    'contact_number' => $staff->contact_number,
                    'address' => $staff->address,
                    'type' => 'staff'
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'data' => $formattedAccounts,
                    'total' => $formattedAccounts->count()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Account listing failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to list accounts: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteStaff($id)
    {
        try {
            $staff = DB::table('staff_tb')->where('id', $id)->first();
            
            if (!$staff) {
                return response()->json([
                    'success' => false,
                    'message' => 'Staff account not found'
                ], 404);
            }

            DB::table('staff_tb')->where('id', $id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Staff account deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Staff deletion failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete staff account: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateStaff(Request $request, $id)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:staff_tb,username,' . $id,
                'role' => 'required|in:admin,meter handler,bill handler',
                'address' => 'required|string|max:255',
                'contact_number' => 'required|string|max:20',
                'email' => 'required|email|max:255'
            ]);

            $staff = DB::table('staff_tb')->where('id', $id)->first();
            
            if (!$staff) {
                return response()->json([
                    'success' => false,
                    'message' => 'Staff account not found'
                ], 404);
            }

            DB::table('staff_tb')->where('id', $id)->update([
                'name' => $request->name,
                'username' => $request->username,
                'role' => $request->role,
                'address' => $request->address,
                'contact_number' => $request->contact_number,
                'email' => $request->email,
                'updated_at' => now()
            ]);

            // If password is provided, update it
            if ($request->filled('password')) {
                DB::table('staff_tb')->where('id', $id)->update([
                    'password' => Hash::make($request->password)
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Staff account updated successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Staff update failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update staff account: ' . $e->getMessage()
            ], 500);
        }
    }
} 
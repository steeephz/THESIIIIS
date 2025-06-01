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
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'role' => 'required|in:admin,meter_reader,bill_handler',
                'employee_id' => 'required|string|unique:staff',
                'department' => 'required|string',
                'contact_number' => 'required|string',
                'address' => 'nullable|string',
                'profile_picture' => 'nullable|image|mimes:jpeg,png,gif|max:2048'
            ]);

            DB::beginTransaction();

            // Create user record
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);

            // Create staff record
            $staff = Staff::create([
                'user_id' => $user->id,
                'role' => $request->role,
                'employee_id' => $request->employee_id,
                'department' => $request->department,
                'contact_number' => $request->contact_number,
                'address' => $request->address
            ]);

            // Handle profile picture upload if provided
            if ($request->hasFile('profile_picture')) {
                $path = $request->file('profile_picture')->store('profile-pictures', 'public');
                $staff->update(['profile_picture' => $path]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Staff account created successfully',
                'data' => [
                    'user' => $user,
                    'staff' => $staff
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Staff account creation failed: ' . $e->getMessage());
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

            $query = User::query();

            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            if ($type === 'staff') {
                $query->whereHas('staff');
            } elseif ($type === 'customer') {
                $query->whereHas('customer');
            }

            $users = $query->with(['staff', 'customer'])->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $users
            ]);

        } catch (\Exception $e) {
            Log::error('Account listing failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to list accounts: ' . $e->getMessage()
            ], 500);
        }
    }
} 
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

            if ($type === 'customer') {
                // Query for customer accounts
                $query = DB::table('customers_tb');

                // Add search conditions if search term exists
                if ($search) {
                    $query->where(function($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('username', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%")
                          ->orWhere('account_number', 'like', "%{$search}%")
                          ->orWhere('meter_number', 'like', "%{$search}%");
                    });
                }

                // Get all customer accounts
                $customerAccounts = $query->get();

                Log::info('Customer accounts found', ['count' => $customerAccounts->count()]);

                // Format the response
                $formattedAccounts = $customerAccounts->map(function($customer) {
                    return [
                        'id' => $customer->id,
                        'name' => $customer->name,
                        'username' => $customer->username,
                        'email' => $customer->email,
                        'customer_type' => $customer->customer_type,
                        'contact_number' => $customer->contact_number,
                        'address' => $customer->address,
                        'account_number' => $customer->account_number,
                        'meter_number' => $customer->meter_number,
                        'type' => 'customer'
                    ];
                });

                return response()->json([
                    'success' => true,
                    'data' => [
                        'data' => $formattedAccounts,
                        'total' => $formattedAccounts->count()
                    ]
                ]);
            }

            // For 'all' type, fetch both staff and customer accounts
            if ($type === 'all') {
                // Query for all staff accounts
                $staffQuery = DB::table('staff_tb');
                if ($search) {
                    $staffQuery->where(function($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('username', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    });
                }
                $staffAccounts = $staffQuery->get();

                // Query for all customer accounts
                $customerQuery = DB::table('customers_tb');
                if ($search) {
                    $customerQuery->where(function($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('username', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%")
                          ->orWhere('account_number', 'like', "%{$search}%")
                          ->orWhere('meter_number', 'like', "%{$search}%");
                    });
                }
                $customerAccounts = $customerQuery->get();

                // Format staff accounts
                $formattedStaffAccounts = $staffAccounts->map(function($staff) {
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

                // Format customer accounts
                $formattedCustomerAccounts = $customerAccounts->map(function($customer) {
                    return [
                        'id' => $customer->id,
                        'name' => $customer->name,
                        'username' => $customer->username,
                        'email' => $customer->email,
                        'customer_type' => $customer->customer_type,
                        'contact_number' => $customer->contact_number,
                        'address' => $customer->address,
                        'account_number' => $customer->account_number,
                        'meter_number' => $customer->meter_number,
                        'type' => 'customer'
                    ];
                });

                // Merge both collections
                $allAccounts = $formattedStaffAccounts->concat($formattedCustomerAccounts);

                return response()->json([
                    'success' => true,
                    'data' => [
                        'data' => $allAccounts,
                        'total' => $allAccounts->count()
                    ]
                ]);
            }

            // Query for staff accounts only
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
            if ($type !== 'all') {
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

    public function createCustomer(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:100',
                'email' => 'required|email|max:100|unique:customers_tb,email',
                'password' => 'required|min:8|max:255',
                'customer_type' => 'required|in:residential,commercial,government|max:20',
                'account_number' => 'required|string|max:9|unique:customers_tb,account_number',
                'meter_number' => 'required|string|max:20|unique:customers_tb,meter_number',
                'contact_number' => 'required|string|max:15',
                'address' => 'required|string'
            ]);

            // Hash the password
            $validated['password'] = bcrypt($validated['password']);

            // Generate username from email (everything before @)
            $username = explode('@', $validated['email'])[0];
            // Ensure username doesn't exceed 50 characters
            $username = substr($username, 0, 50);

            // Insert into customers_tb
            $customer = DB::table('customers_tb')->insertGetId([
                'name' => $validated['name'],
                'username' => $username,
                'password' => $validated['password'],
                'customer_type' => $validated['customer_type'],
                'address' => $validated['address'],
                'contact_number' => $validated['contact_number'],
                'email' => $validated['email'],
                'account_number' => $validated['account_number'],
                'meter_number' => $validated['meter_number'],
                'created_at' => now(),
                'updated_at' => now()
            ]);

            Log::info('New customer created', ['customer_id' => $customer]);

            return response()->json([
                'success' => true,
                'message' => 'Customer created successfully',
                'data' => ['id' => $customer]
            ]);

        } catch (\Exception $e) {
            Log::error('Error creating customer: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create customer: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateCustomer(Request $request, $id)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:customers_tb,username,' . $id,
                'customer_type' => 'required|in:residential,commercial,government',
                'address' => 'required|string|max:255',
                'contact_number' => 'required|string|max:20',
                'email' => 'required|email|max:255|unique:customers_tb,email,' . $id,
                'account_number' => 'required|string|max:20|unique:customers_tb,account_number,' . $id,
                'meter_number' => 'required|string|max:20|unique:customers_tb,meter_number,' . $id
            ]);

            $customer = DB::table('customers_tb')->where('id', $id)->first();
            
            if (!$customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Customer account not found'
                ], 404);
            }

            DB::table('customers_tb')->where('id', $id)->update([
                'name' => $request->name,
                'username' => $request->username,
                'customer_type' => $request->customer_type,
                'address' => $request->address,
                'contact_number' => $request->contact_number,
                'email' => $request->email,
                'account_number' => $request->account_number,
                'meter_number' => $request->meter_number,
                'updated_at' => now()
            ]);

            // If password is provided, update it
            if ($request->filled('password')) {
                DB::table('customers_tb')->where('id', $id)->update([
                    'password' => Hash::make($request->password)
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Customer account updated successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Customer update failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update customer account: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteCustomer($id)
    {
        try {
            $customer = DB::table('customers_tb')->where('id', $id)->first();
            
            if (!$customer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Customer account not found'
                ], 404);
            }

            DB::table('customers_tb')->where('id', $id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Customer account deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Customer deletion failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete customer account: ' . $e->getMessage()
            ], 500);
        }
    }
} 
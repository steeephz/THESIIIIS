<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        try {
            // Get staff user
            $staff = DB::table('staff_tb')->where('username', $request->username)->first();
            
            // Debug log
            Log::info('Login attempt', [
                'username' => $request->username,
                'staff_exists' => $staff ? 'yes' : 'no'
            ]);

            if (!$staff) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials.'
                ], 401);
            }

            // Verify the password using Hash::check
            $passwordValid = Hash::check($request->password, $staff->password);
            
            // Debug log
            Log::info('Password check', [
                'username' => $request->username,
                'password_valid' => $passwordValid ? 'yes' : 'no'
            ]);

            if (!$passwordValid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials.'
                ], 401);
            }

            // Create or update user in users table
            $user = User::updateOrCreate(
                ['email' => $request->username . '@staff.com'],
                [
                    'name' => $request->username,
                    'password' => $staff->password // Use the already hashed password
                ]
            );

            // Log the user in
            Auth::login($user);
            $request->session()->regenerate();

            // Create token for API authentication
            $token = $user->createToken('staff-token')->plainTextToken;

            // Store token in session
            session(['api_token' => $token]);

            return response()->json([
                'success' => true,
                'message' => 'Login successful!',
                'token' => $token,
                'user' => $user
            ]);

        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during login.'
            ], 500);
        }
    }

    public function checkAuth()
    {
        if (Auth::check()) {
            $user = Auth::user();
            // Refresh token if needed
            if (!session('api_token')) {
                $token = $user->createToken('staff-token')->plainTextToken;
                session(['api_token' => $token]);
            }
            return response()->json([
                'authenticated' => true,
                'user' => $user,
                'token' => session('api_token')
            ]);
        }
        return response()->json(['authenticated' => false], 401);
    }

    public function logout(Request $request)
    {
        try {
            // Revoke all tokens
            if (Auth::check()) {
                Auth::user()->tokens()->delete();
            }

            // Clear session data
            Session::flush();
            
            // Logout the user
            Auth::guard('web')->logout();
            
            // Invalidate and regenerate session
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed'
            ], 500);
        }
    }

    public function createStaff(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:staff_tb',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,bill handler,meter handler',
            'address' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'email' => 'required|email|max:255'
        ]);

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
            'message' => 'Staff account created successfully',
            'staff' => $staff
        ], 201);
    }
}


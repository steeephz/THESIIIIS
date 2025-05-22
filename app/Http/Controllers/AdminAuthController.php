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
            // Get admin user
            $admin = DB::table('admin')->where('username', $request->username)->first();
            
            // Debug log
            Log::info('Login attempt', [
                'username' => $request->username,
                'admin_exists' => $admin ? 'yes' : 'no'
            ]);

            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials.'
                ], 401);
            }

            // Compare passwords directly
            $passwordValid = $request->password === $admin->password;
            
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

            // Create or update user record for authentication
            $user = User::updateOrCreate(
                ['email' => $request->username . '@admin.com'],
                [
                    'name' => $request->username,
                    'password' => Hash::make($admin->password) // Hash it for the users table
                ]
            );

            // Log the user in
            Auth::login($user);
            $request->session()->regenerate();

            // Create token for API authentication
            $token = $user->createToken('admin-token')->plainTextToken;

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
                $token = $user->createToken('admin-token')->plainTextToken;
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
} 
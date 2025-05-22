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
            Log::info('Login attempt details', [
                'username' => $request->username,
                'password_length' => strlen($request->password)
            ]);

            // Get admin user
            $admin = DB::table('admin')->where('username', $request->username)->first();
            
            Log::info('Admin user found', [
                'username' => $request->username,
                'exists' => $admin ? 'yes' : 'no',
                'admin_data' => $admin ? json_encode($admin) : null
            ]);

            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials.'
                ], 401);
            }

            // Compare passwords directly
            $passwordValid = trim($request->password) === trim($admin->password);
            
            Log::info('Password validation', [
                'username' => $request->username,
                'input_password' => $request->password,
                'stored_password' => $admin->password,
                'password_valid' => $passwordValid ? 'yes' : 'no',
                'input_length' => strlen($request->password),
                'stored_length' => strlen($admin->password)
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
                    'password' => $admin->password
                ]
            );

            Log::info('User record created/updated', [
                'username' => $request->username,
                'user_id' => $user->id
            ]);

            // Log the user in
            Auth::login($user);
            $request->session()->regenerate();

            // Create token for API authentication
            $token = $user->createToken('admin-token')->plainTextToken;

            // Store token in session
            session(['api_token' => $token]);

            Log::info('Login successful', [
                'username' => $request->username,
                'user_id' => $user->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Login successful!',
                'token' => $token,
                'user' => [
                    'username' => $admin->username,
                    'role' => $admin->role,
                    'email' => $admin->email,
                    'profile_picture' => $admin->profile_picture,
                    'address' => $admin->address,
                    'contact_number' => $admin->contact_number
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Login error', [
                'username' => $request->username,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
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


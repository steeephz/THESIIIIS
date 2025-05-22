<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class AdminProfileController extends Controller
{
    public function show()
    {
        $admin = DB::table('admin')
            ->where('username', Auth::user()->name)
            ->first();

        return response()->json([
            'admin_id' => $admin->id,
            'name' => $admin->username,
            'address' => $admin->address ?? '',
            'contact' => $admin->contact_number ?? '',
            'email' => $admin->email ?? '',
            'role' => $admin->role,
            'profile_picture' => $admin->profile_picture ? url('storage/' . $admin->profile_picture) : null
        ]);
    }

    public function update(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'address' => 'nullable|string|max:255',
                'contact' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'profile_picture' => 'nullable|image|mimes:jpeg,png,gif|max:2048'
            ]);

            $admin = DB::table('admin')
                ->where('username', Auth::user()->name)
                ->first();

            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin not found'
                ], 404);
            }

            $updateData = [
                'username' => $request->name,
                'address' => $request->address,
                'contact_number' => $request->contact,
                'email' => $request->email,
                'updated_at' => now()
            ];

            if ($request->hasFile('profile_picture')) {
                try {
                    $file = $request->file('profile_picture');
                    
                    // Ensure the storage directory exists
                    $storage_path = storage_path('app/public/profile-pictures');
                    if (!file_exists($storage_path)) {
                        mkdir($storage_path, 0755, true);
                    }

                    // Delete old profile picture if exists
                    if ($admin->profile_picture) {
                        $old_path = storage_path('app/public/' . $admin->profile_picture);
                        if (file_exists($old_path)) {
                            unlink($old_path);
                        }
                    }

                    // Generate unique filename
                    $filename = 'profile_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    
                    // Store new profile picture
                    $path = $file->storeAs('profile-pictures', $filename, 'public');
                    if (!$path) {
                        throw new \Exception('Failed to store the file');
                    }
                    
                    $updateData['profile_picture'] = $path;
                } catch (\Exception $e) {
                    \Log::error('Profile picture upload failed: ' . $e->getMessage());
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to upload profile picture: ' . $e->getMessage()
                    ], 500);
                }
            }

            // Update the database
            $updated = DB::table('admin')
                ->where('id', $admin->id)
                ->update($updateData);

            if (!$updated) {
                throw new \Exception('Failed to update database record');
            }

            // Update Auth user name to match new username
            Auth::user()->update(['name' => $request->name]);

            // Return the updated profile data
            $updatedAdmin = DB::table('admin')->where('id', $admin->id)->first();
            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'profile_picture' => $updatedAdmin->profile_picture ? url('storage/' . $updatedAdmin->profile_picture) : null
            ]);

        } catch (\Exception $e) {
            \Log::error('Profile update failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile: ' . $e->getMessage()
            ], 500);
        }
    }
} 
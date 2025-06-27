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
        try {
            $authUser = Auth::user();
            if (!$authUser) {
                return response()->json(['error' => 'Not authenticated'], 401);
            }

            // First try to find by name, then by username as fallback
            $staff = DB::table('staff_tb')
                ->where('name', $authUser->name)
                ->orWhere('username', $authUser->name)
                ->first();

            if (!$staff) {
                \Log::error('Staff not found for user', [
                    'user_name' => $authUser->name,
                    'user_id' => $authUser->id
                ]);
                return response()->json([
                    'error' => 'Staff not found'
                ], 404);
            }

            return response()->json([
                'admin_id' => $staff->id,
                'name' => $staff->name,
                'address' => $staff->address ?? '',
                'contact' => $staff->contact_number ?? '',
                'email' => $staff->email ?? '',
                'role' => $staff->role,
                'profile_picture' => $staff->profile_picture ? url('storage/' . $staff->profile_picture) : null
            ]);
        } catch (\Exception $e) {
            \Log::error('Profile show error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to load profile'], 500);
        }
    }

    public function update(Request $request)
    {
        \Log::info('=== PROFILE UPDATE REQUEST START ===', [
            'request_method' => $request->method(),
            'request_url' => $request->url(),
            'has_file' => $request->hasFile('profile_picture'),
            'content_type' => $request->header('Content-Type'),
            'all_data' => $request->except(['profile_picture']),
            'files' => $request->allFiles()
        ]);
        
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'address' => 'nullable|string|max:255',
                'contact' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'profile_picture' => 'nullable|image|mimes:jpeg,png,gif|max:2048'
            ]);

            $authUser = Auth::user();
            if (!$authUser) {
                return response()->json(['success' => false, 'message' => 'Not authenticated'], 401);
            }

            $staff = DB::table('staff_tb')
                ->where('name', $authUser->name)
                ->orWhere('username', $authUser->name)
                ->first();

            if (!$staff) {
                \Log::error('Staff not found for update', [
                    'user_name' => $authUser->name,
                    'user_id' => $authUser->id
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Staff not found'
                ], 404);
            }

            $updateData = [
                'name' => $request->name,
                'address' => $request->address,
                'contact_number' => $request->contact,
                'email' => $request->email,
                'updated_at' => now()
            ];

            if ($request->hasFile('profile_picture')) {
                try {
                    $file = $request->file('profile_picture');
                    
                    // Validate file
                    if (!$file->isValid()) {
                        throw new \Exception('Invalid file upload');
                    }
                    
                    // Ensure the storage directory exists
                    $storage_path = storage_path('app/public/profile-pictures');
                    if (!file_exists($storage_path)) {
                        mkdir($storage_path, 0755, true);
                    }

                    // Delete old profile picture if exists
                    if ($staff->profile_picture) {
                        $old_path = storage_path('app/public/' . $staff->profile_picture);
                        if (file_exists($old_path)) {
                            @unlink($old_path); // Use @ to suppress warnings if file doesn't exist
                        }
                    }

                    // Generate unique filename
                    $filename = 'profile_' . $staff->id . '_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    
                    // Store new profile picture
                    $path = $file->storeAs('profile-pictures', $filename, 'public');
                    if (!$path) {
                        throw new \Exception('Failed to store the file');
                    }
                    
                    $updateData['profile_picture'] = $path;
                    
                    \Log::info('Profile picture uploaded successfully', [
                        'staff_id' => $staff->id,
                        'filename' => $filename,
                        'path' => $path
                    ]);
                    
                } catch (\Exception $e) {
                    \Log::error('Profile picture upload failed: ' . $e->getMessage(), [
                        'staff_id' => $staff->id,
                        'file_size' => $request->file('profile_picture') ? $request->file('profile_picture')->getSize() : 'unknown',
                        'file_type' => $request->file('profile_picture') ? $request->file('profile_picture')->getMimeType() : 'unknown'
                    ]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to upload profile picture: ' . $e->getMessage()
                    ], 500);
                }
            }

            // Log the update data for debugging
            \Log::info('Updating staff profile', [
                'staff_id' => $staff->id,
                'update_data' => $updateData,
                'has_profile_picture' => isset($updateData['profile_picture'])
            ]);

            // Update the database
            $updated = DB::table('staff_tb')
                ->where('id', $staff->id)
                ->update($updateData);

            \Log::info('Database update result', [
                'updated_rows' => $updated,
                'staff_id' => $staff->id
            ]);

            if (!$updated && !empty($updateData)) {
                throw new \Exception('Failed to update database record - no rows affected');
            }

            // Update Auth user name to match new username
            try {
                $authUser->update(['name' => $request->name]);
            } catch (\Exception $e) {
                \Log::warning('Failed to update auth user name: ' . $e->getMessage());
            }

            // Return the updated profile data
            $updatedStaff = DB::table('staff_tb')->where('id', $staff->id)->first();
            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'profile_picture' => $updatedStaff->profile_picture ? url('storage/' . $updatedStaff->profile_picture) : null,
                'data' => [
                    'name' => $updatedStaff->name,
                    'address' => $updatedStaff->address,
                    'contact_number' => $updatedStaff->contact_number,
                    'email' => $updatedStaff->email,
                    'role' => $updatedStaff->role
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Profile update failed: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'request_data' => $request->except(['profile_picture'])
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile: ' . $e->getMessage()
            ], 500);
        }
    }
} 
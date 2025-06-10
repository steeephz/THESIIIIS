<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = DB::table('announcements_tb')
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($announcements);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'content' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        try {
            $staff = Auth::user();
            
            DB::table('announcements_tb')->insert([
                'title' => $request->title,
                'body' => $request->content,
                'status' => 'active',
                'staff_id' => $staff->id,
                'posted_by' => $staff->name,
                'published_at' => $request->start_date,
                'expired_at' => $request->end_date,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'message' => 'Announcement created successfully',
                'success' => true
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create announcement',
                'success' => false
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'content' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        try {
            DB::table('announcements_tb')
                ->where('id', $id)
                ->update([
                    'title' => $request->title,
                    'body' => $request->content,
                    'published_at' => $request->start_date,
                    'expired_at' => $request->end_date,
                    'updated_at' => now(),
                ]);

            return response()->json([
                'message' => 'Announcement updated successfully',
                'success' => true
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update announcement',
                'success' => false
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::table('announcements_tb')
                ->where('id', $id)
                ->update([
                    'status' => 'inactive',
                    'updated_at' => now()
                ]);

            return response()->json([
                'message' => 'Announcement deleted successfully',
                'success' => true
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete announcement',
                'success' => false
            ], 500);
        }
    }
} 
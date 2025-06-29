<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends Controller
{
    public function index()
    {
        try {
            $announcements = DB::table('announcements_tb')
                ->select([
                    'id',
                    'title',
                    'body',
                    'status',
                    'staff_id',
                    'posted_by',
                    'published_at',
                    'expired_at',
                    'created_at',
                    'updated_at'
                ])
                ->where('status', 'active')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($announcements);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch announcements',
                'error' => $e->getMessage()
            ], 500);
        }
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
            if (!$staff) {
                return response()->json([
                    'message' => 'Not authenticated as staff.',
                    'success' => false
                ], 401);
            }
            if (!isset($staff->id) || !isset($staff->name)) {
                return response()->json([
                    'message' => 'Staff user missing id or name.',
                    'success' => false
                ], 400);
            }
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
                'error' => $e->getMessage(),
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

    /**
     * Get all announcements for history report (both active and inactive)
     */
    public function history(Request $request)
    {
        try {
            $query = DB::table('announcements_tb')
                ->select([
                    'id',
                    'title',
                    'body',
                    'status',
                    'staff_id',
                    'posted_by',
                    'published_at',
                    'expired_at',
                    'created_at',
                    'updated_at'
                ]);

            // Filter by status if provided
            if ($request->has('status') && $request->status !== 'All') {
                $query->where('status', $request->status);
            }

            // Add search functionality
            if ($request->has('search') && $request->search !== '') {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%$search%")
                      ->orWhere('body', 'like', "%$search%")
                      ->orWhere('posted_by', 'like', "%$search%");
                });
            }

            // Add pagination
            $perPage = $request->get('per_page', 10);
            $announcements = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $announcements
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch announcement history: ' . $e->getMessage()
            ], 500);
        }
    }
} 
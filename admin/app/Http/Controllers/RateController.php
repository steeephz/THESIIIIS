<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rate;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RateController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'customer_type' => 'required|string|in:commercial,residential,government',
            'minimum_charge' => 'required|numeric|min:0',
            'rate_per_cu_m' => 'required|numeric|min:0',
        ]);

        try {
            // First, mark all existing active rates for this customer type as inactive
            DB::table('rates_tb')
                ->where('customer_type', Str::lower($request->customer_type))
                ->where('status', 'active')
                ->update([
                    'status' => 'inactive',
                    'updated_at' => now()
                ]);

            // Then insert the new rate as active
            DB::table('rates_tb')->insert([
                'customer_type' => Str::lower($request->customer_type),
                'minimum_charge' => $request->minimum_charge,
                'rate_per_cu_m' => $request->rate_per_cu_m,
                'effective_datec' => now()->toDateString(),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json(['message' => 'Rate added successfully']);
        } catch (\Exception $e) {
            \Log::error('Failed to add rate: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to add rate: ' . $e->getMessage()], 500);
        }
    }

    public function index()
    {
        try {
            $rates = DB::table('rates_tb')
                ->where('status', 'active')
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json($rates);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch rates: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch rates'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'minimum_charge' => 'required|numeric|min:0',
            'rate_per_cu_m' => 'required|numeric|min:0',
        ]);

        try {
            // Get the current rate to find its customer type
            $currentRate = DB::table('rates_tb')->where('id', $id)->first();
            
            if (!$currentRate) {
                return response()->json(['error' => 'Rate not found'], 404);
            }

            // Mark all existing active rates for this customer type as inactive
            DB::table('rates_tb')
                ->where('customer_type', $currentRate->customer_type)
                ->where('status', 'active')
                ->update([
                    'status' => 'inactive',
                    'updated_at' => now()
                ]);

            // Update the current rate with new values and mark as active
            DB::table('rates_tb')
                ->where('id', $id)
                ->update([
                    'minimum_charge' => $request->minimum_charge,
                    'rate_per_cu_m' => $request->rate_per_cu_m,
                    'effective_datec' => now()->toDateString(),
                    'status' => 'active',
                    'updated_at' => now(),
                ]);

            return response()->json(['message' => 'Rate updated successfully']);
        } catch (\Exception $e) {
            \Log::error('Failed to update rate: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update rate: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::table('rates_tb')
                ->where('id', $id)
                ->update([
                    'status' => 'inactive',
                    'updated_at' => now()
                ]);

            return response()->json(['message' => 'Rate deleted successfully']);
        } catch (\Exception $e) {
            \Log::error('Failed to delete rate: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete rate'], 500);
        }
    }
} 
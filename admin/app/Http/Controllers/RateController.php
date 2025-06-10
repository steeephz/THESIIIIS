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
            DB::table('rates_tb')->insert([
                'customer_type' => Str::lower($request->customer_type),
                'minimum_charge' => $request->minimum_charge,
                'rate_per_cu_m' => $request->rate_per_cu_m,
                'effective_datec' => now(),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json(['message' => 'Rate added successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to add rate'], 500);
        }
    }

    public function index()
    {
        $rates = DB::table('rates_tb')
            ->where('status', 'active')
            ->get();
        
        return response()->json($rates);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'minimum_charge' => 'required|numeric|min:0',
            'rate_per_cu_m' => 'required|numeric|min:0',
        ]);

        try {
            DB::table('rates_tb')
                ->where('id', $id)
                ->update([
                    'minimum_charge' => $request->minimum_charge,
                    'rate_per_cu_m' => $request->rate_per_cu_m,
                    'updated_at' => now(),
                ]);

            return response()->json(['message' => 'Rate updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update rate'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::table('rates_tb')
                ->where('id', $id)
                ->update(['status' => 'inactive']);

            return response()->json(['message' => 'Rate deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete rate'], 500);
        }
    }
} 
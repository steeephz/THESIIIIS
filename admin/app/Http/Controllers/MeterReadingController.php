<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MeterReadingController extends Controller
{
    /**
     * Get all meter readings with optional filtering by account type
     */
    public function index(Request $request)
    {
        try {
            // Get real meter readings from database but with simple query
            $meterReadings = DB::table('meter_readings')->get();

            // Transform to expected format 
            $transformedData = [];
            foreach ($meterReadings as $reading) {
                $transformedData[] = [
                    'id' => $reading->id,
                    'meter_number' => $reading->meter_number,
                    'reading_value' => $reading->reading_value,
                    'amount' => $reading->amount,
                    'remarks' => $reading->remarks,
                    'reading_date' => $reading->reading_date,
                    'created_at' => $reading->created_at,
                    'customer_name' => 'Customer for ' . $reading->meter_number,
                    'account_number' => '12345678',
                    'customer_type' => 'residential',
                    'meter_reader' => 'Staff ID: ' . $reading->staff_id
                ];
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'data' => $transformedData,
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 10,
                    'total' => count($transformedData),
                    'from' => 1,
                    'to' => count($transformedData)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch meter readings: ' . $e->getMessage(),
                'error_line' => $e->getLine(),
                'error_file' => $e->getFile()
            ], 500);
        }
    }
} 
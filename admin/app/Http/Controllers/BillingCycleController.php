<?php

namespace App\Http\Controllers;

use App\Models\BillingCycle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class BillingCycleController extends Controller
{
    /**
     * Display a listing of billing cycles with filtering.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = BillingCycle::query();
            
            // Apply filters
            if ($request->filled('account_type') && $request->account_type !== 'All') {
                $query->where('account_type', $request->account_type);
            }
            
            if ($request->filled('billing_period')) {
                $query->where('billing_period', $request->billing_period);
            }
            
            if ($request->filled('status') && $request->status !== 'All') {
                $query->where('status', $request->status);
            }
            
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('customer', 'ILIKE', "%{$search}%")
                      ->orWhere('account_number', 'ILIKE', "%{$search}%");
                });
            }
            
            $billingCycles = $query->orderBy('created_at', 'desc')->get();
            
            return response()->json($billingCycles);
        } catch (\Exception $e) {
            Log::error('Billing cycles fetch error: ' . $e->getMessage());
            return response()->json([]);
        }
    }

    /**
     * Generate billing cycles from customers_tb for a specific period.
     */
    public function generateFromCustomers(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'billing_period' => 'required|string',
                'due_days' => 'integer|min:1|max:90',
                'overwrite' => 'boolean'
            ]);

            $billingPeriod = $validated['billing_period'];
            $dueDays = $validated['due_days'] ?? 15; // Default 15 days
            $overwrite = $validated['overwrite'] ?? false;

            // Check if billing cycles already exist for this period
            if (!$overwrite) {
                $existingCount = BillingCycle::where('billing_period', $billingPeriod)->count();
                if ($existingCount > 0) {
                    return response()->json([
                        'success' => false,
                        'message' => "Billing cycles already exist for period {$billingPeriod}. Use overwrite option to replace them.",
                        'existing_count' => $existingCount
                    ], 409);
                }
            } else {
                // Delete existing cycles for this period
                BillingCycle::where('billing_period', $billingPeriod)->delete();
            }

            // Get all customers
            $customers = DB::table('customers_tb')
                ->select('id', 'name', 'account_number', 'customer_type', 'meter_number', 'address')
                ->get();

            if ($customers->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No customers found to generate billing cycles.'
                ], 404);
            }

            // Get default rates for calculation
            $rates = DB::table('rates_tb')
                ->where('status', 'active')
                ->get()
                ->keyBy('customer_type');

            $generatedCount = 0;
            $errors = [];

            foreach ($customers as $customer) {
                try {
                    // Get latest meter reading for this customer
                    $latestReading = DB::table('meter_readings')
                        ->where('meter_number', $customer->meter_number)
                        ->orderBy('reading_date', 'desc')
                        ->first();

                    // Get second latest for previous reading
                    $previousReading = DB::table('meter_readings')
                        ->where('meter_number', $customer->meter_number)
                        ->orderBy('reading_date', 'desc')
                        ->skip(1)
                        ->first();

                    // Calculate readings and consumption
                    $currentReading = $latestReading ? (int)$latestReading->reading_value : 0;
                    $prevReading = $previousReading ? (int)$previousReading->reading_value : 0;
                    $consumption = max(0, $currentReading - $prevReading);

                    // Get rate for customer type
                    $customerType = strtolower($customer->customer_type);
                    $rate = $rates->get($customerType);
                    $rateAmount = $rate ? $rate->rate_per_cu_m : 25.00; // Default rate
                    $minimumCharge = $rate ? $rate->minimum_charge : 185.00; // Default minimum

                    // Calculate amount
                    $amount = max($minimumCharge, $consumption * $rateAmount);

                    // Set dates
                    $cycleDate = Carbon::now();
                    $dueDate = $cycleDate->copy()->addDays($dueDays);
                    $meterReadingDate = $latestReading ? Carbon::parse($latestReading->reading_date) : $cycleDate;

                    // Create billing cycle
                    BillingCycle::create([
                        'customer' => $customer->name,
                        'account_number' => $customer->account_number,
                        'current_reading' => $currentReading,
                        'previous_reading' => $prevReading,
                        'amount_due' => $amount,
                        'due_date' => $dueDate,
                        'status' => 'Active',
                        'account_type' => ucfirst($customerType),
                        'billing_period' => $billingPeriod,
                        'cycle_date' => $cycleDate,
                        'meter_reading_date' => $meterReadingDate,
                        'consumption' => $consumption,
                        'rate' => $rateAmount,
                        'total_amount' => $amount,
                        'bill_generated' => $cycleDate,
                        'payment_status' => 'Unpaid',
                        'remarks' => 'Auto-generated from customer records'
                    ]);

                    $generatedCount++;

                } catch (\Exception $e) {
                    $errors[] = "Failed to generate cycle for {$customer->name}: " . $e->getMessage();
                    Log::error("Billing cycle generation error for customer {$customer->id}: " . $e->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Successfully generated {$generatedCount} billing cycles for period {$billingPeriod}",
                'generated_count' => $generatedCount,
                'total_customers' => $customers->count(),
                'errors' => $errors
            ]);

        } catch (\Exception $e) {
            Log::error('Billing cycle generation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate billing cycles: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified billing cycle.
     */
    public function show(BillingCycle $billingCycle): JsonResponse
    {
        return response()->json($billingCycle);
    }

    /**
     * Update the specified billing cycle.
     */
    public function update(Request $request, BillingCycle $billingCycle): JsonResponse
    {
        try {
            $validated = $request->validate([
                'status' => 'sometimes|string|max:30',
                'payment_status' => 'sometimes|string|max:30',
                'remarks' => 'sometimes|string',
                'amount_due' => 'sometimes|numeric|min:0',
                'due_date' => 'sometimes|date',
                'current_reading' => 'sometimes|integer|min:0',
                'previous_reading' => 'sometimes|integer|min:0',
            ]);

            // Recalculate consumption if readings are updated
            if (isset($validated['current_reading']) || isset($validated['previous_reading'])) {
                $currentReading = $validated['current_reading'] ?? $billingCycle->current_reading;
                $previousReading = $validated['previous_reading'] ?? $billingCycle->previous_reading;
                $validated['consumption'] = max(0, $currentReading - $previousReading);
            }

            $billingCycle->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Billing cycle updated successfully',
                'data' => $billingCycle
            ]);

        } catch (\Exception $e) {
            Log::error('Billing cycle update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update billing cycle: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified billing cycle.
     */
    public function destroy(BillingCycle $billingCycle): JsonResponse
    {
        try {
            $billingCycle->delete();

            return response()->json([
                'success' => true,
                'message' => 'Billing cycle deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Billing cycle deletion error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete billing cycle: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get billing periods that have been generated.
     */
    public function getBillingPeriods(): JsonResponse
    {
        try {
            $periods = BillingCycle::select('billing_period')
                ->distinct()
                ->whereNotNull('billing_period')
                ->orderBy('billing_period', 'desc')
                ->pluck('billing_period');

            return response()->json($periods);
        } catch (\Exception $e) {
            Log::error('Get billing periods error: ' . $e->getMessage());
            return response()->json([]);
        }
    }

    /**
     * Get statistics for billing cycles.
     */
    public function getStatistics(Request $request): JsonResponse
    {
        try {
            $period = $request->get('period');
            
            $query = BillingCycle::query();
            if ($period) {
                $query->where('billing_period', $period);
            }

            $stats = [
                'total_cycles' => $query->count(),
                'total_amount' => $query->sum('amount_due'),
                'paid_cycles' => $query->where('payment_status', 'Paid')->count(),
                'unpaid_cycles' => $query->where('payment_status', 'Unpaid')->count(),
                'overdue_cycles' => $query->where('due_date', '<', Carbon::now())->where('payment_status', '!=', 'Paid')->count(),
                'by_account_type' => $query->selectRaw('account_type, COUNT(*) as count, SUM(amount_due) as total_amount')
                    ->groupBy('account_type')
                    ->get()
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            Log::error('Billing cycle statistics error: ' . $e->getMessage());
            return response()->json([]);
        }
    }
} 
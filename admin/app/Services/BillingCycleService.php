<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BillingCycleService
{
    /**
     * Create billing cycles for all customers
     */
    public function createBillingCyclesForAllCustomers()
    {
        try {
            $customers = DB::table('customers_tb')->get();
            $createdCount = 0;
            $updatedCount = 0;
            $errors = [];

            foreach ($customers as $customer) {
                $result = $this->createOrUpdateBillingCycle($customer);
                
                if ($result['action'] === 'created') {
                    $createdCount++;
                } elseif ($result['action'] === 'updated') {
                    $updatedCount++;
                } else {
                    $errors[] = "Customer {$customer->id}: " . $result['message'];
                }
            }

            return [
                'success' => true,
                'message' => "Billing cycles processed successfully",
                'created_count' => $createdCount,
                'updated_count' => $updatedCount,
                'errors' => $errors
            ];

        } catch (\Exception $e) {
            \Log::error('Error creating billing cycles for all customers: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error creating billing cycles: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Create or update billing cycle for a specific customer
     */
    public function createOrUpdateBillingCycle($customer)
    {
        try {
            // Calculate billing dates based on customer creation date
            $billingStartDate = Carbon::parse($customer->created_at);
            $billingEndDate = $billingStartDate->copy()->addMonth();
            
            // Check if billing cycle already exists for this customer
            $existingCycle = DB::table('billing_cycles_tb')
                ->where('customer_id', $customer->id)
                ->first();
            
            if ($existingCycle) {
                // Update existing cycle
                DB::table('billing_cycles_tb')
                    ->where('id', $existingCycle->id)
                    ->update([
                        'billing_start_date' => $billingStartDate->format('Y-m-d'),
                        'billing_end_date' => $billingEndDate->format('Y-m-d'),
                        'status' => 'active',
                        'amount_due' => 0.00
                    ]);
                
                return ['action' => 'updated', 'cycle_id' => $existingCycle->id];
            } else {
                // Create new billing cycle
                $cycleId = DB::table('billing_cycles_tb')->insertGetId([
                    'customer_id' => $customer->id,
                    'billing_start_date' => $billingStartDate->format('Y-m-d'),
                    'billing_end_date' => $billingEndDate->format('Y-m-d'),
                    'status' => 'active',
                    'amount_due' => 0.00,
                    'created_at' => now()
                ]);
                
                return ['action' => 'created', 'cycle_id' => $cycleId];
            }
            
        } catch (\Exception $e) {
            \Log::error('Error creating billing cycle for customer ' . $customer->id . ': ' . $e->getMessage());
            return ['action' => 'error', 'message' => $e->getMessage()];
        }
    }

    /**
     * Sync billing cycles when a new customer is created
     */
    public function syncBillingCycleForNewCustomer($customerId)
    {
        try {
            $customer = DB::table('customers_tb')->where('id', $customerId)->first();
            
            if (!$customer) {
                throw new \Exception('Customer not found');
            }
            
            return $this->createOrUpdateBillingCycle($customer);
            
        } catch (\Exception $e) {
            \Log::error('Error syncing billing cycle for new customer ' . $customerId . ': ' . $e->getMessage());
            return ['action' => 'error', 'message' => $e->getMessage()];
        }
    }

    /**
     * Update billing cycles when customer is updated
     */
    public function updateBillingCyclesForCustomer($customerId)
    {
        try {
            $customer = DB::table('customers_tb')->where('id', $customerId)->first();
            
            if (!$customer) {
                throw new \Exception('Customer not found');
            }
            
            // Update all billing cycles for this customer
            $updatedCount = DB::table('billing_cycles_tb')
                ->where('customer_id', $customerId)
                ->update([
                    'status' => 'active'
                ]);
            
            return [
                'action' => 'updated',
                'updated_count' => $updatedCount
            ];
            
        } catch (\Exception $e) {
            \Log::error('Error updating billing cycles for customer ' . $customerId . ': ' . $e->getMessage());
            return ['action' => 'error', 'message' => $e->getMessage()];
        }
    }

    /**
     * Delete billing cycles when customer is deleted
     */
    public function deleteBillingCyclesForCustomer($customerId)
    {
        try {
            $deletedCount = DB::table('billing_cycles_tb')
                ->where('customer_id', $customerId)
                ->delete();
            
            return [
                'action' => 'deleted',
                'deleted_count' => $deletedCount
            ];
            
        } catch (\Exception $e) {
            \Log::error('Error deleting billing cycles for customer ' . $customerId . ': ' . $e->getMessage());
            return ['action' => 'error', 'message' => $e->getMessage()];
        }
    }

    /**
     * Get billing cycles with customer information
     */
    public function getBillingCyclesWithFilters($filters = [])
    {
        try {
            $query = DB::table('billing_cycles_tb')
                ->join('customers_tb', 'billing_cycles_tb.customer_id', '=', 'customers_tb.id')
                ->select(
                    'billing_cycles_tb.id',
                    'billing_cycles_tb.customer_id',
                    'billing_cycles_tb.billing_start_date',
                    'billing_cycles_tb.billing_end_date',
                    'billing_cycles_tb.status',
                    'billing_cycles_tb.amount_due',
                    'billing_cycles_tb.created_at',
                    'customers_tb.full_name as customer',
                    'customers_tb.account_number',
                    'customers_tb.customer_type as account_type',
                    'customers_tb.email',
                    'customers_tb.contact_number'
                );
            
            // Apply filters
            if (!empty($filters['account_type']) && $filters['account_type'] !== 'All') {
                $query->where('customers_tb.customer_type', $filters['account_type']);
            }
            
            if (!empty($filters['billing_period'])) {
                $query->whereRaw("DATE_FORMAT(billing_cycles_tb.billing_start_date, '%Y-%m') = ?", [$filters['billing_period']]);
            }
            
            if (!empty($filters['search'])) {
                $search = $filters['search'];
                $query->where(function($q) use ($search) {
                    $q->where('customers_tb.full_name', 'like', "%{$search}%")
                      ->orWhere('customers_tb.account_number', 'like', "%{$search}%");
                });
            }
            
            if (!empty($filters['status']) && $filters['status'] !== 'All') {
                $query->where('billing_cycles_tb.status', $filters['status']);
            }
            
            return $query->orderBy('billing_cycles_tb.created_at', 'desc')->get();
            
        } catch (\Exception $e) {
            \Log::error('Error getting billing cycles: ' . $e->getMessage());
            return collect([]);
        }
    }
} 
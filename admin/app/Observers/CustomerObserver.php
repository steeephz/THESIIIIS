<?php

namespace App\Observers;

use App\Services\BillingCycleService;
use Illuminate\Support\Facades\Log;

class CustomerObserver
{
    protected $billingCycleService;

    public function __construct(BillingCycleService $billingCycleService)
    {
        $this->billingCycleService = $billingCycleService;
    }

    /**
     * Handle the Customer "created" event.
     */
    public function created($customer): void
    {
        try {
            Log::info('Customer created, syncing billing cycle for customer ID: ' . $customer->id);
            $this->billingCycleService->syncBillingCycleForNewCustomer($customer->id);
        } catch (\Exception $e) {
            Log::error('Error syncing billing cycle for new customer ' . $customer->id . ': ' . $e->getMessage());
        }
    }

    /**
     * Handle the Customer "updated" event.
     */
    public function updated($customer): void
    {
        try {
            Log::info('Customer updated, updating billing cycles for customer ID: ' . $customer->id);
            $this->billingCycleService->updateBillingCyclesForCustomer($customer->id);
        } catch (\Exception $e) {
            Log::error('Error updating billing cycles for customer ' . $customer->id . ': ' . $e->getMessage());
        }
    }

    /**
     * Handle the Customer "deleted" event.
     */
    public function deleted($customer): void
    {
        try {
            Log::info('Customer deleted, deleting billing cycles for customer ID: ' . $customer->id);
            $this->billingCycleService->deleteBillingCyclesForCustomer($customer->id);
        } catch (\Exception $e) {
            Log::error('Error deleting billing cycles for customer ' . $customer->id . ': ' . $e->getMessage());
        }
    }

    /**
     * Handle the Customer "restored" event.
     */
    public function restored($customer): void
    {
        try {
            Log::info('Customer restored, syncing billing cycle for customer ID: ' . $customer->id);
            $this->billingCycleService->syncBillingCycleForNewCustomer($customer->id);
        } catch (\Exception $e) {
            Log::error('Error syncing billing cycle for restored customer ' . $customer->id . ': ' . $e->getMessage());
        }
    }

    /**
     * Handle the Customer "force deleted" event.
     */
    public function forceDeleted($customer): void
    {
        try {
            Log::info('Customer force deleted, deleting billing cycles for customer ID: ' . $customer->id);
            $this->billingCycleService->deleteBillingCyclesForCustomer($customer->id);
        } catch (\Exception $e) {
            Log::error('Error deleting billing cycles for force deleted customer ' . $customer->id . ': ' . $e->getMessage());
        }
    }
} 
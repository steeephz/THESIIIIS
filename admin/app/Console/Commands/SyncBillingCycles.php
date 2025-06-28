<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\BillingCycleService;
use Illuminate\Support\Facades\Log;

class SyncBillingCycles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'billing:sync-all-customers {--force : Force sync even if billing cycles exist}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync all customers from customers_tb to billing_cycles_tb';

    protected $billingCycleService;

    /**
     * Create a new command instance.
     */
    public function __construct(BillingCycleService $billingCycleService)
    {
        parent::__construct();
        $this->billingCycleService = $billingCycleService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting billing cycle synchronization for all customers...');

        try {
            $result = $this->billingCycleService->createBillingCyclesForAllCustomers();

            if ($result['success']) {
                $this->info('✅ ' . $result['message']);
                $this->info("📊 Created: {$result['created_count']} billing cycles");
                $this->info("📊 Updated: {$result['updated_count']} billing cycles");
                
                Log::info('Billing cycle sync completed successfully', $result);
            } else {
                $this->error('❌ ' . $result['message']);
                Log::error('Billing cycle sync failed', $result);
                return 1;
            }

        } catch (\Exception $e) {
            $this->error('❌ Error during billing cycle sync: ' . $e->getMessage());
            Log::error('Billing cycle sync error: ' . $e->getMessage());
            return 1;
        }

        $this->info('🎉 Billing cycle synchronization completed!');
        return 0;
    }
} 
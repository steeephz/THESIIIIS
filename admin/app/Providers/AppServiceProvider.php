<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Observers\CustomerObserver;
use Illuminate\Support\Facades\DB;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Register the CustomerObserver to automatically sync billing cycles
        // Note: Since we're using Supabase and not Eloquent models, we'll handle this manually
        // in the controllers where customers are created/updated/deleted
    }
}

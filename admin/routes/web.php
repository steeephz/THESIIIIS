<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminAuthController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Public routes
Route::get('/', function () {
    return Inertia::render('AdminLogin');
});

Route::post('/api/admin-login', [AdminAuthController::class, 'login']);

// Protected routes
Route::middleware(['auth:sanctum', 'web', 'admin.auth'])->prefix('admin')->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
    
    Route::get('/dashboard', function () {
        return Inertia::render('AdminDashboard');
    })->name('admin.dashboard');

    Route::get('/profile', function () {
        return Inertia::render('Profile', [
            'auth' => [
                'user' => request()->user(),
            ],
        ]);
    })->name('admin.profile');

    // Remove or comment out these conflicting routes as they're for a different profile system
    // Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/accounts', function () {
        return Inertia::render('Accounts');
    })->name('admin.accounts');

    Route::get('/announcement', function () {
        return Inertia::render('Announcement');
    })->name('admin.announcement');

    Route::get('/tickets', function () {
        return Inertia::render('Tickets');
    })->name('admin.tickets');

    Route::get('/reports', function () {
        return Inertia::render('Reports');
    })->name('admin.reports');

    Route::get('/payment', function () {
        return Inertia::render('Payment');
    })->name('admin.payment');

    Route::get('/rate-management', function () {
        return Inertia::render('RateManagement');
    })->name('admin.rateManagement');
});

Route::middleware(['auth:sanctum', 'web'])->group(function () {
    // Admin Dashboard
    Route::get('/admin/dashboard', function () {
        return Inertia::render('AdminDashboard');
    })->name('admin.dashboard');

    // Bill Handler Dashboard
    Route::get('/bill-handler/dashboard', function () {
        return Inertia::render('BillHandlerDashboard');
    })->name('bill-handler.dashboard');

    // Bill Handler Tickets (sync with admin tickets)
    Route::get('/bill-handler/tickets', function () {
        return Inertia::render('Tickets');
    })->name('bill-handler.tickets');

    // Bill Handler Billing
    Route::get('/bill-handler/billing', function () {
        return Inertia::render('BillHandlerBilling');
    })->name('bill-handler.billing');

    // Bill Handler Customers
    Route::get('/bill-handler/customers', function () {
        return Inertia::render('BillHandlerCustomers');
    })->name('bill-handler.customers');
});

require __DIR__.'/auth.php';

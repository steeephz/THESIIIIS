<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminProfileController;
use App\Http\Controllers\AccountController;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\BillHandlerController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\RateController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\BillPaymentValidationController;
use App\Http\Controllers\MeterReadingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::post('/admin-login', [AdminAuthController::class, 'login']);
Route::post('/admin-logout', [AdminAuthController::class, 'logout']);
Route::get('/check-auth', [AdminAuthController::class, 'checkAuth'])->middleware(['web']);
Route::post('/create-staff', [AdminAuthController::class, 'createStaff']);

// Temporary public routes (for testing)
Route::get('/meter-readings', [MeterReadingController::class, 'index']);

// Protected routes
Route::middleware(['web'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Admin Profile Routes
    Route::get('/admin/profile', [AdminProfileController::class, 'show']);
    Route::post('/admin/profile/update', [AdminProfileController::class, 'update']);

    // Account Management Routes  
    Route::prefix('accounts')->group(function () {
        Route::get('/', [AccountController::class, 'listAccounts']);
        Route::post('/staff', [AccountController::class, 'createStaffAccount']);
        Route::put('/staff/{id}', [AccountController::class, 'updateStaff']);
        Route::delete('/staff/{id}', [AccountController::class, 'deleteStaff']);
        Route::post('/customer', [AccountController::class, 'createCustomer']); // Use the newer createCustomer method
        Route::put('/customer/{id}', [AccountController::class, 'updateCustomer']);
        Route::delete('/customer/{id}', [AccountController::class, 'deleteCustomer']);
    });

    // Bill Handler Routes
    Route::prefix('bill-handler')->group(function () {
        Route::get('/bill-handler-dashboard', [BillHandlerController::class, 'BillHandlerDashboard']);
        Route::get('/customers', [BillHandlerController::class, 'getCustomers']);
    });

    // Rate Management Routes
    Route::get('/rates', [RateController::class, 'index']);
    Route::post('/rates', [RateController::class, 'store']);
    Route::put('/rates/{id}', [RateController::class, 'update']);
    Route::delete('/rates/{id}', [RateController::class, 'destroy']);

    // Announcement Routes
    Route::get('/announcements', [AnnouncementController::class, 'index']);
    Route::post('/announcements', [AnnouncementController::class, 'store']);
    Route::put('/announcements/{id}', [AnnouncementController::class, 'update']);
    Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);
    Route::get('/announcements/history', [AnnouncementController::class, 'history']);

    // Payment Routes
    Route::prefix('payments')->group(function () {
        Route::get('/', [PaymentController::class, 'index']);
        Route::post('/', [PaymentController::class, 'store']);
        Route::post('/{id}/approve', [PaymentController::class, 'approve']);
    });

    // Ticket Routes
    Route::prefix('tickets')->group(function () {
        Route::get('/', [TicketController::class, 'index']);
        Route::patch('/{id}', [TicketController::class, 'update']);
    });

    // Bill Payment Validation Routes
    Route::get('/bill-payment-validation', [BillPaymentValidationController::class, 'index']);
    Route::patch('/bill-payment-validation/{id}/status', [BillPaymentValidationController::class, 'updateStatus']);
});

// Temporary debug routes
Route::get('/debug/check-admin', function() {
    $admins = DB::table('admin')->get();
    return response()->json([
        'admins' => $admins,
        'count' => $admins->count()
    ]);
});

Route::get('/debug/check-staff', function() {
    $staff = DB::table('staff_tb')->get();
    return response()->json([
        'staff' => $staff,
        'count' => $staff->count()
    ]);
});







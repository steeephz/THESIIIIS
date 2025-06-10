<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Customer;
use App\Models\Bill;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Get all payments with optional filtering
     */
    public function index(Request $request)
    {
        $query = Payment::with(['user', 'customer'])
            ->orderBy('created_at', 'desc');

        if ($request->has('accountType') && $request->accountType !== 'All') {
            $query->whereHas('customer', function ($q) use ($request) {
                $q->where('customer_type', strtolower($request->accountType));
            });
        }

        $payments = $query->get();

        return response()->json($payments);
    }

    /**
     * Approve a payment
     */
    public function approve($id)
    {
        $payment = Payment::with('customer')->findOrFail($id);
        
        // Verify customer details before approval
        if (!$payment->verifyCustomerDetails()) {
            $payment->status = 'Verification_Failed';
            $payment->save();
            return response()->json([
                'message' => 'Payment verification failed. Customer details do not match.',
                'errors' => ['verification' => 'Account number or meter number mismatch']
            ], 400);
        }
        
        // Start a database transaction
        DB::beginTransaction();
        
        try {
            $payment->status = 'Approved';
            $payment->approved_at = now();
            $payment->save();

            // If this was a partial payment, update the bill's remaining balance
            if ($payment->payment_type === 'Partial') {
                $bill = $payment->bill;
                $bill->remaining_balance -= $payment->amount;
                
                // If the remaining balance is 0 or less, mark the bill as paid
                if ($bill->remaining_balance <= 0) {
                    $bill->status = 'Paid';
                }
                
                $bill->save();
            }

            DB::commit();
            return response()->json(['message' => 'Payment approved successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error approving payment'], 500);
        }
    }

    /**
     * Store a new payment from mobile app
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'customer_id' => 'required|exists:customers,id',
            'bill_id' => 'required|exists:bills,id',
            'amount' => 'required|numeric|min:0',
            'payment_type' => 'required|in:Full,Partial',
            'payment_method' => 'required|string',
            'account_number' => 'required|string',
            'meter_number' => 'required|string',
            'proof_of_payment' => 'required|image|max:2048', // Max 2MB
        ]);

        // Verify customer details
        $customer = Customer::where('id', $validated['customer_id'])
            ->where('account_number', $validated['account_number'])
            ->where('meter_number', $validated['meter_number'])
            ->first();

        if (!$customer) {
            return response()->json([
                'message' => 'Payment verification failed',
                'errors' => ['verification' => 'Customer details do not match our records']
            ], 400);
        }

        DB::beginTransaction();

        try {
            // Get the bill
            $bill = Bill::findOrFail($validated['bill_id']);

            // Validate payment amount
            if ($validated['payment_type'] === 'Full' && $validated['amount'] != $bill->total_amount) {
                throw new \Exception('Full payment amount must match the bill total');
            }

            if ($validated['payment_type'] === 'Partial' && $validated['amount'] >= $bill->total_amount) {
                throw new \Exception('Partial payment amount must be less than the bill total');
            }

            // Store proof of payment
            $proofPath = $request->file('proof_of_payment')->store('payment_proofs', 'public');

            // Create payment record
            $payment = Payment::create([
                'user_id' => $validated['user_id'],
                'customer_id' => $validated['customer_id'],
                'bill_id' => $validated['bill_id'],
                'amount' => $validated['amount'],
                'payment_type' => $validated['payment_type'],
                'payment_method' => $validated['payment_method'],
                'account_number' => $validated['account_number'],
                'meter_number' => $validated['meter_number'],
                'proof_of_payment' => $proofPath,
                'status' => 'Pending',
                'remaining_balance' => $validated['payment_type'] === 'Partial' 
                    ? $bill->total_amount - $validated['amount']
                    : 0
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Payment recorded successfully',
                'payment' => $payment
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
} 
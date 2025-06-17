<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BillPaymentValidation;

class BillPaymentValidationController extends Controller
{
    public function index(Request $request)
    {
        $query = BillPaymentValidation::query();

        // Optional filters
        if ($request->has('account_type') && $request->account_type !== 'All') {
            $query->where('account_type', $request->account_type);
        }
        if ($request->has('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }
        if ($request->has('period') && $request->period !== '') {
            $query->where('period', $request->period);
        }
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('customer', 'like', "%$search%")
                  ->orWhere('account_number', 'like', "%$search%");
            });
        }

        $bills = $query->orderBy('created_at', 'desc')->get();
        return response()->json($bills);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Confirmed,Rejected',
        ]);
        $bill = BillPaymentValidation::findOrFail($id);
        $bill->status = $request->status;
        $bill->save();
        return response()->json(['message' => 'Status updated successfully']);
    }
} 
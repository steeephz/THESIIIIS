<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BillController extends Controller
{
    public function index(Request $request)
    {
        $query = DB::table('bills_tb')
            ->join('customers_tb', 'bills_tb.customer_id', '=', 'customers_tb.id')
            ->select(
                'bills_tb.*',
                'customers_tb.name as customer',
                'customers_tb.account_number',
                'customers_tb.customer_type as account_type'
            );

        // Optional filters
        if ($request->has('account_type') && $request->account_type !== 'All') {
            $query->where('customers_tb.customer_type', $request->account_type);
        }
        if ($request->has('status') && $request->status !== 'All') {
            $query->where('bills_tb.status', $request->status);
        }
        if ($request->has('period') && $request->period !== '') {
            $query->whereRaw("DATE_FORMAT(bills_tb.billing_date, '%Y-%m') = ?", [$request->period]);
        }
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('customers_tb.name', 'like', "%$search%")
                  ->orWhere('customers_tb.account_number', 'like', "%$search%");
            });
        }

        $bills = $query->orderBy('bills_tb.created_at', 'desc')->get();
        return response()->json($bills);
    }
}

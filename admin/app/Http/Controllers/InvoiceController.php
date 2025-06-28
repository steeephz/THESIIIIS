<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InvoiceController extends Controller
{
    /**
     * Display a listing of invoices.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Invoice::with(['customer']);

        // Filter by account type (via customer relationship)
        if ($request->filled('account_type') && $request->account_type !== 'All') {
            $query->whereHas('customer', function ($q) use ($request) {
                $q->where('account_type', $request->account_type);
            });
        }

        // Filter by status
        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        // Filter by invoice date (using month format)
        if ($request->filled('period')) {
            $period = $request->period; // Expected format: YYYY-MM
            $query->whereYear('invoice_date', substr($period, 0, 4))
                  ->whereMonth('invoice_date', substr($period, 5, 2));
        }

        // Search by customer name, account number, or meter number
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('meter_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($customerQuery) use ($search) {
                      $customerQuery->where('name', 'like', "%{$search}%")
                                   ->orWhere('account_number', 'like', "%{$search}%");
                  });
            });
        }

        $invoices = $query->orderBy('invoice_date', 'desc')->get();

        // Add customer data to each invoice for frontend
        $invoices->each(function ($invoice) {
            if ($invoice->customer) {
                $invoice->customer_name = $invoice->customer->name;
                $invoice->account_number = $invoice->customer->account_number;
                $invoice->account_type = $invoice->customer->account_type;
            }
        });

        return response()->json($invoices);
    }

    /**
     * Store a newly created invoice.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers_tb,id',
            'reading_id' => 'required|exists:meter_readings,id',
            'due_date' => 'required|date',
            'reading_value' => 'required|integer|min:0',
            'meter_number' => 'required|string|max:50',
            'amount' => 'required|numeric|min:0',
            'sent_via' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);

        // Create invoice
        $invoice = Invoice::create([
            'customer_id' => $validated['customer_id'],
            'reading_id' => $validated['reading_id'],
            'invoice_date' => now(),
            'due_date' => $validated['due_date'],
            'reading_value' => $validated['reading_value'],
            'meter_number' => $validated['meter_number'],
            'amount' => $validated['amount'],
            'status' => 'Pending',
            'sent_via' => $validated['sent_via'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ]);

        // Load customer relationship for response
        $invoice->load('customer');

        return response()->json($invoice, 201);
    }

    /**
     * Generate bulk invoices for multiple customers.
     */
    public function bulkGenerate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'invoices' => 'required|array',
            'invoices.*.customer_id' => 'required|exists:customers_tb,id',
            'invoices.*.reading_id' => 'required|exists:meter_readings,id',
            'invoices.*.due_date' => 'required|date',
            'invoices.*.reading_value' => 'required|integer|min:0',
            'invoices.*.meter_number' => 'required|string|max:50',
            'invoices.*.amount' => 'required|numeric|min:0',
            'invoices.*.sent_via' => 'nullable|string|max:20',
            'invoices.*.notes' => 'nullable|string',
        ]);

        $createdInvoices = [];

        foreach ($validated['invoices'] as $invoiceData) {
            $invoice = Invoice::create([
                'customer_id' => $invoiceData['customer_id'],
                'reading_id' => $invoiceData['reading_id'],
                'invoice_date' => now(),
                'due_date' => $invoiceData['due_date'],
                'reading_value' => $invoiceData['reading_value'],
                'meter_number' => $invoiceData['meter_number'],
                'amount' => $invoiceData['amount'],
                'status' => 'Pending',
                'sent_via' => $invoiceData['sent_via'] ?? null,
                'notes' => $invoiceData['notes'] ?? null,
            ]);

            $invoice->load('customer');
            $createdInvoices[] = $invoice;
        }

        return response()->json([
            'message' => 'Invoices generated successfully',
            'count' => count($createdInvoices),
            'invoices' => $createdInvoices
        ]);
    }

    /**
     * Display the specified invoice.
     */
    public function show(Invoice $invoice): JsonResponse
    {
        $invoice->load('customer');
        
        // Add customer data for frontend compatibility
        if ($invoice->customer) {
            $invoice->customer_name = $invoice->customer->name;
            $invoice->account_number = $invoice->customer->account_number;
            $invoice->account_type = $invoice->customer->account_type;
        }

        return response()->json($invoice);
    }

    /**
     * Update the specified invoice.
     */
    public function update(Request $request, Invoice $invoice): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:Pending,Sent,Paid,Overdue,Cancelled',
            'notes' => 'sometimes|string',
            'due_date' => 'sometimes|date',
            'sent_via' => 'sometimes|string|max:20',
            'pdf_url' => 'sometimes|url',
            'amount' => 'sometimes|numeric|min:0',
        ]);

        $invoice->update($validated);
        $invoice->load('customer');

        return response()->json($invoice);
    }

    /**
     * Remove the specified invoice.
     */
    public function destroy(Invoice $invoice): JsonResponse
    {
        $invoice->delete();

        return response()->json(['message' => 'Invoice deleted successfully']);
    }
} 
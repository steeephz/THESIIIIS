<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TicketController extends Controller
{
    public function index()
    {
        try {
            $tickets = DB::table('tickets_tb')
                ->select(
                    'ticket_id as id',
                    'subject',
                    'status',
                    'ticket_remarks as remarks',
                    'remarks_history',
                    'created_at as created',
                    'updated_at as updated'
                )
                ->orderBy('created_at', 'desc')
                ->get();

            // Transform the data to match the frontend format
            $formattedTickets = $tickets->map(function ($ticket) {
                $remarksHistory = $ticket->remarks_history ? json_decode($ticket->remarks_history, true) : [];
                
                // If no history exists, create initial history from current remarks
                if (empty($remarksHistory)) {
                    $remarksHistory = [
                        [
                            'id' => 1,
                            'remarks' => $ticket->remarks,
                            'timestamp' => $ticket->created,
                            'user' => 'Admin User'
                        ]
                    ];
                }

                return [
                    'id' => $ticket->id,
                    'subject' => $ticket->subject,
                    'status' => $ticket->status,
                    'created' => $ticket->created,
                    'updated' => $ticket->updated,
                    'remarks' => $ticket->remarks,
                    'remarksHistory' => $remarksHistory
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedTickets
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching tickets: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:open,pending,resolved,closed',
                'remarks' => 'required|string'
            ]);

            // Get current ticket data
            $currentTicket = DB::table('tickets_tb')
                ->select('remarks_history')
                ->where('ticket_id', $id)
                ->first();

            // Prepare new remarks history entry
            $newHistoryEntry = [
                'id' => $currentTicket->remarks_history ? count(json_decode($currentTicket->remarks_history, true)) + 1 : 1,
                'remarks' => $validated['remarks'],
                'timestamp' => now()->toISOString(),
                'user' => 'Admin User'
            ];

            // Update remarks history
            $remarksHistory = $currentTicket->remarks_history ? json_decode($currentTicket->remarks_history, true) : [];
            $remarksHistory[] = $newHistoryEntry;

            // Update the ticket
            DB::table('tickets_tb')
                ->where('ticket_id', $id)
                ->update([
                    'status' => $validated['status'],
                    'ticket_remarks' => $validated['remarks'],
                    'remarks_history' => json_encode($remarksHistory),
                    'updated_at' => now()
                ]);

            // Fetch the updated ticket
            $updatedTicket = DB::table('tickets_tb')
                ->select(
                    'ticket_id as id',
                    'subject',
                    'status',
                    'ticket_remarks as remarks',
                    'remarks_history',
                    'created_at as created',
                    'updated_at as updated'
                )
                ->where('ticket_id', $id)
                ->first();

            return response()->json([
                'success' => true,
                'message' => 'Ticket updated successfully',
                'data' => [
                    'id' => $updatedTicket->id,
                    'subject' => $updatedTicket->subject,
                    'status' => $updatedTicket->status,
                    'created' => $updatedTicket->created,
                    'updated' => $updatedTicket->updated,
                    'remarks' => $updatedTicket->remarks,
                    'remarksHistory' => json_decode($updatedTicket->remarks_history, true)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating ticket: ' . $e->getMessage()
            ], 500);
        }
    }
} 
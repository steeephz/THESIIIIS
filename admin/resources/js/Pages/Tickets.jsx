import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import DynamicTitleLayout from '@/Layouts/DynamicTitleLayout';
import BillHandlerLayout from '@/Layouts/BillHandlerLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Pending', value: 'pending' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' }
];

const statusUpdateOptions = [
  { label: 'Open', value: 'open' },
  { label: 'Pending', value: 'pending' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' }
];

const initialTickets = [
  {
    id: 1001,
    subject: 'Water Pressure Issue',
    status: 'open',
    created: '2024-03-20T09:30:00',
    remarks: 'Customer reported low water pressure in the morning',
    remarksHistory: [
      {
        id: 1,
        remarks: 'Customer reported low water pressure in the morning',
        timestamp: '2024-03-20T09:30:00',
        user: 'Admin User'
      }
    ]
  },
  {
    id: 1002,
    subject: 'Billing Dispute',
    status: 'pending',
    created: '2024-03-19T14:15:00',
    remarks: 'Customer questioning unusually high bill amount',
    remarksHistory: [
      {
        id: 1,
        remarks: 'Initial complaint received',
        timestamp: '2024-03-19T14:15:00',
        user: 'Admin User'
      },
      {
        id: 2,
        remarks: 'Customer questioning unusually high bill amount',
        timestamp: '2024-03-19T15:30:00',
        user: 'Support Staff'
      }
    ]
  },
  {
    id: 1003,
    subject: 'Meter Reading Request',
    status: 'resolved',
    created: '2024-03-18T11:45:00',
    remarks: 'Customer requested manual meter reading verification',
    remarksHistory: [
      {
        id: 1,
        remarks: 'Customer requested manual meter reading verification',
        timestamp: '2024-03-18T11:45:00',
        user: 'Admin User'
      },
      {
        id: 2,
        remarks: 'Meter reading verified and updated in system',
        timestamp: '2024-03-18T14:20:00',
        user: 'Technical Staff'
      }
    ]
  },
  {
    id: 1004,
    subject: 'Leak Report',
    status: 'closed',
    created: '2024-03-17T16:20:00',
    remarks: 'Major leak in main water line, emergency repair completed',
    remarksHistory: [
      {
        id: 1,
        remarks: 'Emergency leak reported',
        timestamp: '2024-03-17T16:20:00',
        user: 'Admin User'
      },
      {
        id: 2,
        remarks: 'Repair team dispatched',
        timestamp: '2024-03-17T16:45:00',
        user: 'Support Staff'
      },
      {
        id: 3,
        remarks: 'Major leak in main water line, emergency repair completed',
        timestamp: '2024-03-17T18:30:00',
        user: 'Technical Staff'
      }
    ]
  },
  {
    id: 1005,
    subject: 'Service Reconnection',
    status: 'open',
    created: '2024-03-16T10:00:00',
    remarks: 'Customer requesting service reconnection after payment',
    remarksHistory: [
      {
        id: 1,
        remarks: 'Customer requesting service reconnection after payment',
        timestamp: '2024-03-16T10:00:00',
        user: 'Admin User'
      }
    ]
  }
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Tickets = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [filteredTickets, setFilteredTickets] = useState(initialTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewingRemarks, setViewingRemarks] = useState(null);

  // Determine layout based on path
  const isBillHandler = typeof window !== 'undefined' && window.location.pathname.startsWith('/bill-handler');
  const Layout = isBillHandler ? BillHandlerLayout : AdminLayout;
  const userRole = isBillHandler ? 'bill handler' : 'admin';

  useEffect(() => {
    let filtered = [...tickets];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toString().includes(searchQuery)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket =>
        ticket.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(ticket => {
        const ticketDate = new Date(ticket.created);
        return ticketDate.toDateString() === filterDate.toDateString();
      });
    }

    setFilteredTickets(filtered);
  }, [searchQuery, statusFilter, dateFilter, tickets]);

  const handleStatusUpdate = (ticketId, newStatus) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const newRemarksHistory = [
          ...ticket.remarksHistory,
          {
            id: ticket.remarksHistory.length + 1,
            remarks: remarks || ticket.remarks,
            timestamp: new Date().toISOString(),
            user: 'Admin User' // This should be replaced with actual logged-in user
          }
        ];
        return {
          ...ticket,
          status: newStatus,
          remarks: remarks || ticket.remarks,
          remarksHistory: newRemarksHistory
        };
      }
      return ticket;
    });
    setTickets(updatedTickets);
    setViewing(null);
    setRemarks('');
  };

  return (
    <DynamicTitleLayout userRole={userRole}>
      <Layout>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h1 className="text-xl font-semibold">Tickets</h1>
        </div>
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Search */}
            <div className="flex flex-col w-full max-w-[350px] min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Tickets</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID or subject..."
                className="w-full max-w-[350px] min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Status Filter */}
            <div className="flex flex-col w-full max-w-[350px] min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full max-w-[350px] min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Date Filter */}
            <div className="flex flex-col w-full max-w-[350px] min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <DatePicker
                selected={dateFilter}
                onChange={date => setDateFilter(date)}
                className="w-full max-w-[350px] min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Select date"
                dateFormat="MMMM d, yyyy"
              />
            </div>
          </div>
        </div>
        {/* Tickets Table */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 font-semibold min-w-[120px] max-w-[120px]">Ticket ID</th>
                <th className="py-2 px-4 font-semibold min-w-[200px] max-w-[300px]">Subject</th>
                <th className="py-2 px-4 font-semibold min-w-[120px] max-w-[160px]">Status</th>
                <th className="py-2 px-4 font-semibold min-w-[180px] max-w-[200px]">Created</th>
                <th className="py-2 px-4 font-semibold min-w-[120px] max-w-[140px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-2">Loading tickets...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No tickets found
                  </td>
                </tr>
              ) : (
                filteredTickets.map(ticket => (
                  <tr key={ticket.id} className="border-b hover:bg-blue-50">
                    <td className="py-2 px-4 min-w-[120px] max-w-[120px]">{ticket.id}</td>
                    <td className="py-2 px-4 min-w-[200px] max-w-[300px] truncate">{ticket.subject}</td>
                    <td className="py-2 px-4 min-w-[120px] max-w-[160px]">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                          ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          ticket.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                        <button
                          onClick={() => setViewingRemarks(ticket)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Ticket Remarks
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-4 min-w-[180px] max-w-[200px]">{formatDate(ticket.created)}</td>
                    <td className="py-2 px-4 min-w-[120px] max-w-[140px]">
                      <button
                        onClick={() => setViewing(ticket)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* View Ticket Modal */}
        {viewing && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Ticket #{viewing.id}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <p className="text-gray-900">{viewing.subject}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={viewing.status}
                    onChange={(e) => setViewing({...viewing, status: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusUpdateOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <p className="text-gray-900">{formatDate(viewing.created)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Remarks</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add remarks about this ticket..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setViewing(null);
                    setRemarks('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusUpdate(viewing.id, viewing.status)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Ticket
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Remarks Modal */}
        {viewingRemarks && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Ticket #{viewingRemarks.id} Remarks</h2>
                <button
                  onClick={() => setViewingRemarks(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <p className="text-gray-900">{viewingRemarks.subject}</p>
                </div>
                
                {/* Remarks History */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remarks History</label>
                  <div className="bg-gray-50 rounded-lg divide-y divide-gray-200 max-h-60 overflow-y-auto">
                    {viewingRemarks.remarksHistory.map((history, index) => (
                      <div key={history.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">{history.user}</span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{formatDate(history.timestamp)}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{history.remarks}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add New Remarks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add New Remarks</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add new remarks..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setViewingRemarks(null);
                    setRemarks('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleStatusUpdate(viewingRemarks.id, viewingRemarks.status);
                    setViewingRemarks(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Remarks
                </button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </DynamicTitleLayout>
  );
};

export default Tickets; 
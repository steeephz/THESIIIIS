import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import DynamicTitleLayout from '@/Layouts/DynamicTitleLayout';
import BillHandlerLayout from '@/Layouts/BillHandlerLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Notification from '@/Components/Notification';

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
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewingRemarks, setViewingRemarks] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Determine layout based on path
  const isBillHandler = typeof window !== 'undefined' && window.location.pathname.startsWith('/bill-handler');
  const Layout = isBillHandler ? BillHandlerLayout : AdminLayout;
  const userRole = isBillHandler ? 'bill handler' : 'admin';

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/tickets');
        if (response.data.success) {
          setTickets(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

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

  const handleStatusUpdate = async (ticketId, newStatus) => {
    // Only proceed if remarks field is not empty
    if (!remarks.trim()) {
      setNotification({ show: true, message: 'Please enter a new remark before updating.', type: 'error' });
      return;
    }
    try {
      const response = await axios.patch(`/api/tickets/${ticketId}`, {
        status: newStatus,
        remarks: remarks
      });
      if (response.data.success) {
        const updatedTickets = tickets.map(ticket => {
          if (ticket.id === ticketId) {
            return response.data.data; // Use the updated ticket data from the response
          }
          return ticket;
        });
        setTickets(updatedTickets);
        setViewing(null);
        setRemarks('');
        setNotification({ show: true, message: 'Ticket updated successfully!', type: 'success' });
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      setNotification({ show: true, message: 'Failed to update ticket.', type: 'error' });
    }
  };

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

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
                <th className="py-2 px-4 font-semibold min-w-[180px] max-w-[200px]">Last Updated</th>
                <th className="py-2 px-4 font-semibold min-w-[120px] max-w-[140px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-2">Loading tickets...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">
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
                    <td className="py-2 px-4 min-w-[180px] max-w-[200px]">{formatDate(ticket.updated)}</td>
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
            <div className="bg-white rounded-xl p-10 w-full max-w-4xl min-w-[700px]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Ticket Details</h2>
                <button
                  onClick={() => setViewing(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <p className="mt-1 text-gray-900">{viewing.subject}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={viewing.status}
                    onChange={(e) => handleStatusUpdate(viewing.id, e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusUpdateOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Remarks History</label>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {viewing.remarksHistory.slice().reverse().map((history) => (
                      <div key={history.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-sm text-gray-800">{history.user}</span>
                          <span className="text-xs text-gray-500">{formatDate(history.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-900 mt-1">{history.remarks}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Add New Remarks</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add new remarks..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  />
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
                    Update Remarks
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Remarks</label>
                  <p className="mt-1 text-gray-900">{viewing.remarks}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Remarks Modal */}
        {viewingRemarks && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-10 w-full max-w-4xl min-w-[700px] h-[600px]">
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
                  <div className="bg-gray-50 rounded-lg divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                    {viewingRemarks.remarksHistory.slice().reverse().map((history, index) => (
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
              </div>
            </div>
          </div>
        )}
        {notification.show && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ ...notification, show: false })}
          />
        )}
      </Layout>
    </DynamicTitleLayout>
  );
};

export default Tickets; 
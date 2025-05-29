import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';

const initialTickets = [
  { id: 101, subject: 'No water supply', status: 'Open', created: '2025-05-20' },
  { id: 102, subject: 'Billing issue', status: 'Closed', created: '2025-05-18' },
  { id: 103, subject: 'Request for reconnection', status: 'Open', created: '2025-05-17' },
];

const statusOptions = [
  { label: 'Resolved', value: 'Resolved' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Unresolvable', value: 'Unresolvable' },
];

const Tickets = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [form, setForm] = useState({ subject: '' });
  const [viewing, setViewing] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTickets([
      ...tickets,
      { id: Date.now(), subject: form.subject, status: 'Open', created: new Date().toISOString().slice(0, 10) },
    ]);
    setForm({ subject: '' });
  };

  const handleStatusChange = (status) => {
    if (viewing) {
      setTickets(tickets.map(t => t.id === viewing.id ? { ...t, status } : t));
      setViewing({ ...viewing, status });
    }
  };

  const handleView = (ticket) => {
    setViewing(ticket);
  };

  const handleCloseModal = () => {
    setViewing(null);
  };

  return (
    <div className="min-h-screen bg-[#60B5FF] font-[Poppins] overflow-x-hidden">
      <div className="fixed left-0 top-0 h-full w-[240px] bg-white shadow-lg transform transition-transform duration-200 lg:translate-x-0 md:translate-x-0 -translate-x-full">
        <div className="p-3">
          <img src="https://i.postimg.cc/fTdMBwmQ/hermosa-logo.png" alt="Logo" className="w-50 h-50 mx-auto mb-3" />
        </div>
        <nav className="mt-4">
          <Link href="/admin/dashboard" className={`flex items-center px-6 py-3 text-base text-gray-600 hover:bg-gray-50 ${window.location.pathname === '/admin/dashboard' ? 'text-blue-600 bg-blue-50' : ''}`}> 
            <span className="material-symbols-outlined mr-3">dashboard</span>
            Dashboard
          </Link>
          <Link href="/admin/announcement" className={`flex items-center px-6 py-3 text-base text-gray-600 hover:bg-gray-50 ${window.location.pathname === '/admin/announcement' ? 'text-blue-600 bg-blue-50' : ''}`}> 
            <span className="material-symbols-outlined mr-3">campaign</span>
            Announcement
          </Link>
          <Link href="/admin/accounts" className={`flex items-center px-6 py-3 text-base text-gray-600 hover:bg-gray-50 ${window.location.pathname === '/admin/accounts' ? 'text-blue-600 bg-blue-50' : ''}`}> 
            <span className="material-symbols-outlined mr-3">manage_accounts</span>
            Manage Accounts
          </Link>
          <Link href="/admin/rate-management" className={`flex items-center px-6 py-3 text-base text-gray-600 hover:bg-gray-50 ${window.location.pathname === '/admin/rate-management' ? 'text-blue-600 bg-blue-50' : ''}`}> 
            <span className="material-symbols-outlined mr-3">price_change</span>
            Rate Management
          </Link>
          <Link href="/admin/payment" className={`flex items-center px-6 py-3 text-base text-gray-600 hover:bg-gray-50 ${window.location.pathname === '/admin/payment' ? 'text-blue-600 bg-blue-50' : ''}`}> 
            <span className="material-symbols-outlined mr-3">payments</span>
            Payment
          </Link>
          <Link href="/admin/reports" className={`flex items-center px-6 py-3 text-base text-gray-600 hover:bg-gray-50 ${window.location.pathname === '/admin/reports' ? 'text-blue-600 bg-blue-50' : ''}`}> 
            <span className="material-symbols-outlined mr-3">description</span>
            Reports
          </Link>
          <Link href="/admin/tickets" className={`flex items-center px-6 py-3 text-base text-blue-600 bg-blue-50 ${window.location.pathname === '/admin/tickets' ? 'text-blue-600 bg-blue-50' : ''}`}> 
            <span className="material-symbols-outlined mr-3">confirmation_number</span>
            Tickets
          </Link>
          <Link href="/admin/profile" className={`flex items-center px-6 py-3 text-base text-gray-600 hover:bg-gray-50 ${window.location.pathname === '/admin/profile' ? 'text-blue-600 bg-blue-50' : ''}`}> 
            <span className="material-symbols-outlined mr-3">person</span>
            Profile
          </Link>
          <button
            onClick={async () => {
              try {
                await axios.get('/sanctum/csrf-cookie');
                await axios.post('/admin/logout');
                window.location.href = '/';
              } catch (error) {
                window.location.href = '/';
              }
            }}
            className="flex items-center px-6 py-3 text-base text-red-600 hover:bg-red-50 w-full text-left"
          >
            <span className="material-symbols-outlined mr-3">logout</span>
            Logout
          </button>
        </nav>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white h-14 flex items-center justify-between px-4 z-20">
        <button className="text-gray-600 hover:text-gray-800">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <img src="https://i.postimg.cc/fTdMBwmQ/hermosa-logo.png" alt="Logo" className="h-8" />
        <div></div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-[240px] p-3 sm:p-4 md:p-6 lg:p-6 pt-16 lg:pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h1 className="text-xl font-semibold">Tickets</h1>
        </div>

        {/* Tickets Table */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 font-semibold">Ticket ID</th>
                <th className="py-2 px-4 font-semibold">Subject</th>
                <th className="py-2 px-4 font-semibold">Status</th>
                <th className="py-2 px-4 font-semibold">Created</th>
                <th className="py-2 px-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets
                .slice()
                .sort((a, b) => new Date(a.created) - new Date(b.created))
                .map(ticket => (
                  <tr key={ticket.id} className="border-b hover:bg-blue-50">
                    <td className="py-2 px-4">{ticket.id}</td>
                    <td className="py-2 px-4">{ticket.subject}</td>
                    <td className="py-2 px-4">
                      <span className={ticket.status === 'Open' ? 'text-green-600' : 'text-gray-500'}>{ticket.status}</span>
                    </td>
                    <td className="py-2 px-4">{ticket.created}</td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        onClick={() => handleView(ticket)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View"
                      >
                        👁️ View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* View Ticket Modal */}
        {viewing && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-2">Ticket #{viewing.id}</h2>
              <p className="mb-2"><span className="font-semibold">Subject:</span> {viewing.subject}</p>
              <p className="mb-2"><span className="font-semibold">Status:</span> {viewing.status}</p>
              <p className="mb-2"><span className="font-semibold">Created:</span> {viewing.created}</p>
              <div className="flex gap-2 mt-4">
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`px-4 py-2 rounded-lg font-semibold border transition-colors duration-150 ${viewing.status === option.value ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-100'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCloseModal}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets; 
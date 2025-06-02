import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';

const accountTypes = ['Commercial', 'Residential', 'Government'];
const initialRates = {
  Commercial: [],
  Residential: [],
  Government: [],
};

const RateManagement = () => {
  const [activeTab, setActiveTab] = useState('Commercial');
  const [rates, setRates] = useState(initialRates);
  const [form, setForm] = useState({ min_charge: '', per_cubic: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updated = [...rates[activeTab]];
      updated[editingIndex] = { ...form };
      setRates({ ...rates, [activeTab]: updated });
      setEditingIndex(null);
    } else {
      setRates({ ...rates, [activeTab]: [...rates[activeTab], { ...form }] });
    }
    setForm({ min_charge: '', per_cubic: '' });
  };

  const handleEdit = (idx) => {
    setForm(rates[activeTab][idx]);
    setEditingIndex(idx);
  };

  const handleDelete = (idx) => {
    const updated = rates[activeTab].filter((_, i) => i !== idx);
    setRates({ ...rates, [activeTab]: updated });
    setEditingIndex(null);
    setForm({ min_charge: '', per_cubic: '' });
  };

  return (
    <div className="min-h-screen bg-[#60B5FF] font-[Poppins] overflow-x-hidden">
      <div className="fixed left-0 top-0 h-full w-[240px] bg-white shadow-lg transform transition-transform duration-200 lg:translate-x-0 md:translate-x-0 -translate-x-full flex flex-col">
                <div className="p-3 flex-shrink-0">
                    <img src="https://i.postimg.cc/fTdMBwmQ/hermosa-logo.png" alt="Logo" className="w-50 h-50 mx-auto mb-3" />
                </div>
                <nav className="flex flex-col flex-1 overflow-y-auto">
                    <div className="flex-1 pb-4">
                        <Link href="/admin/dashboard" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <span className="material-symbols-outlined mr-3">dashboard</span>
                            Dashboard
                        </Link>
                        <Link href="/admin/announcement" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/announcement' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <span className="material-symbols-outlined mr-3">campaign</span>
                            Announcement
                        </Link>
                        <Link href="/admin/accounts" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/accounts' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <span className="material-symbols-outlined mr-3">manage_accounts</span>
                            Manage Accounts
                        </Link>
                        <Link href="/admin/rate-management" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/rate-management' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <span className="material-symbols-outlined mr-3">price_change</span>
                            Rate Management
                        </Link>
                        <Link href="/admin/payment" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/payment' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <span className="material-symbols-outlined mr-3">payments</span>
                            Payment
                        </Link>
                        <Link href="/admin/reports" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/reports' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <span className="material-symbols-outlined mr-3">description</span>
                            Reports
                        </Link>
                        <Link href="/admin/tickets" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/tickets' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <span className="material-symbols-outlined mr-3">confirmation_number</span>
                            Tickets
                        </Link>
                        <Link href="/admin/profile" className={`flex items-center px-6 py-3 text-base ${window.location.pathname === '/admin/profile' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <span className="material-symbols-outlined mr-3">person</span>
                            Profile
                        </Link>
                    </div>
                    <div className="flex-shrink-0">
                        <button
                            onClick={async () => {
                                if (window.confirm('Are you sure you want to log out?')) {
                                    try {
                                        await axios.get('/sanctum/csrf-cookie');
                                        await axios.post('/admin/logout');
                                        window.location.href = '/';
                                    } catch (error) {
                                        window.location.href = '/';
                                    }
                                }
                            }}
                            className="flex items-center px-6 py-3 text-base text-gray-600 hover:text-red-600 hover:bg-red-50 w-full text-left"
                        >
                            <span className="material-symbols-outlined mr-3">logout</span>
                            Logout
                        </button>
                    </div>
                </nav>
            </div>
      <div className="lg:ml-[240px] p-3 sm:p-4 md:p-6 lg:p-6 pt-16 lg:pt-6">
        <h1 className="text-2xl font-bold mb-8">Rate Management</h1>
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-10">
          {/* Tabs */}
          <div className="flex border-b mb-8">
            {accountTypes.map(type => (
              <button
                key={type}
                className={`px-8 py-3 text-lg font-semibold focus:outline-none transition-colors ${activeTab === type ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-500'}`}
                onClick={() => { setActiveTab(type); setForm({ min_charge: '', per_cubic: '' }); setEditingIndex(null); }}
              >
                {type}
              </button>
            ))}
          </div>
          {/* Tab Content */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6 mb-10">
              <div className="flex gap-8">
                <div className="flex-1">
                  <label className="block text-base font-medium mb-2">Minimum Charge</label>
                  <input
                    type="number"
                    name="min_charge"
                    value={form.min_charge}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-base font-medium mb-2">Rate per Cubic Meter</label>
                  <input
                    type="number"
                    name="per_cubic"
                    value={form.per_cubic}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-base font-semibold"
              >
                {editingIndex !== null ? 'Update' : 'Add'} Rate
              </button>
              {editingIndex !== null && (
                <button
                  type="button"
                  onClick={() => { setForm({ min_charge: '', per_cubic: '' }); setEditingIndex(null); }}
                  className="ml-4 bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 text-base font-semibold"
                >
                  Cancel
                </button>
              )}
            </form>
            <h2 className="text-xl font-bold mb-6">{activeTab} Rates</h2>
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Minimum Charge</th>
                  <th className="py-2 px-4 text-left">Rate per Cubic Meter</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rates[activeTab].length === 0 ? (
                  <tr><td colSpan="3" className="text-center py-4 text-gray-400">No rates set.</td></tr>
                ) : (
                  rates[activeTab].map((rate, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-4">{rate.min_charge}</td>
                      <td className="py-2 px-4">{rate.per_cubic}</td>
                      <td className="py-2 px-4">
                        <button onClick={() => handleEdit(idx)} className="text-blue-600 hover:underline mr-4 text-base font-medium px-3 py-1">Edit</button>
                        <button onClick={() => handleDelete(idx)} className="text-red-600 hover:underline text-base font-medium px-3 py-1">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateManagement; 
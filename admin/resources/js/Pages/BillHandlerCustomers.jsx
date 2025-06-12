import React, { useState } from 'react';
import BillHandlerLayout from '@/Layouts/BillHandlerLayout';
import DynamicTitleLayout from '@/Layouts/DynamicTitleLayout';

const mockCustomers = [
  {
    id: 1,
    name: 'John Doe',
    accountNumber: '12001234',
    accountType: 'Residential',
    address: '123 Main St, City',
    contact: '09171234567',
    email: 'john@example.com',
    status: 'Active',
    billingStatus: 'Unpaid',
  },
  {
    id: 2,
    name: 'Jane Smith',
    accountNumber: '23004567',
    accountType: 'Commercial',
    address: '456 Commerce Ave, City',
    contact: '09179876543',
    email: 'jane@example.com',
    status: 'Active',
    billingStatus: 'Paid',
  },
  {
    id: 3,
    name: 'Gov Office',
    accountNumber: '31006789',
    accountType: 'Government',
    address: '789 Gov Rd, City',
    contact: '09170001122',
    email: 'gov@example.com',
    status: 'Inactive',
    billingStatus: 'Overdue',
  },
];

function formatAccountNumber(num) {
  const str = num.toString().padStart(8, '0');
  return str.slice(0, 2) + '-' + str.slice(2);
}

const BillHandlerCustomers = () => {
  const [customerAccountType, setCustomerAccountType] = useState('All');
  const [customerSearch, setCustomerSearch] = useState('');
  const [customers, setCustomers] = useState(mockCustomers);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'Active').length;
  const inactiveCustomers = customers.filter(c => c.status === 'Inactive').length;
  const overdueAccounts = customers.filter(c => c.billingStatus === 'Overdue').length;

  const filteredCustomers = customers.filter(cust => {
    const matchesType = customerAccountType === 'All' || cust.accountType === customerAccountType;
    const matchesSearch =
      cust.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      formatAccountNumber(cust.accountNumber).includes(customerSearch);
    return matchesType && matchesSearch;
  });

  function openCustomerModal(cust) {
    setSelectedCustomer(cust);
    setShowCustomerModal(true);
  }

  return (
    <DynamicTitleLayout userRole="bill handler">
      <BillHandlerLayout>
        <div className="max-w-full mx-auto p-2 sm:p-4 lg:p-6">
          <h1 className="text-2xl font-bold mb-6">Customers</h1>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 5.87v-2a4 4 0 00-3-3.87m6 5.87a4 4 0 01-3-3.87m0 0a4 4 0 013-3.87m0 0V4a4 4 0 00-8 0v8a4 4 0 003 3.87" /></svg>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Total Customers</div>
                <div className="text-xl font-bold">{totalCustomers}</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              <div className="bg-green-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Active Customers</div>
                <div className="text-xl font-bold">{activeCustomers}</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              <div className="bg-gray-200 p-2 rounded-full">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-1.414 1.414A9 9 0 105.636 18.364l1.414-1.414A7 7 0 1116.95 7.05z" /></svg>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Inactive Customers</div>
                <div className="text-xl font-bold">{inactiveCustomers}</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              <div className="bg-red-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <div className="text-gray-500 text-sm">Overdue Accounts</div>
                <div className="text-xl font-bold">{overdueAccounts}</div>
              </div>
            </div>
          </div>
          {/* Main Card */}
          <div className="bg-white rounded-lg shadow p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <select
                  value={customerAccountType}
                  onChange={e => setCustomerAccountType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                  <option value="Government">Government</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  value={customerSearch}
                  onChange={e => setCustomerSearch(e.target.value)}
                  placeholder="Search by name or account number"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 font-semibold">Customer Name</th>
                    <th className="py-2 px-4 font-semibold">Account Number</th>
                    <th className="py-2 px-4 font-semibold">Account Type</th>
                    <th className="py-2 px-4 font-semibold">Address</th>
                    <th className="py-2 px-4 font-semibold">Contact</th>
                    <th className="py-2 px-4 font-semibold">Email</th>
                    <th className="py-2 px-4 font-semibold">Status</th>
                    <th className="py-2 px-4 font-semibold">Billing Status (Current Month)</th>
                    <th className="py-2 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-4 text-center text-gray-500">No customers found</td>
                    </tr>
                  ) : (
                    filteredCustomers.map(cust => (
                      <tr key={cust.id} className="border-b">
                        <td className="py-2 px-4">{cust.name}</td>
                        <td className="py-2 px-4">{formatAccountNumber(cust.accountNumber)}</td>
                        <td className="py-2 px-4">{cust.accountType}</td>
                        <td className="py-2 px-4">{cust.address}</td>
                        <td className="py-2 px-4">{cust.contact}</td>
                        <td className="py-2 px-4">{cust.email}</td>
                        <td className="py-2 px-4">{cust.status}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            cust.billingStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                            cust.billingStatus === 'Unpaid' ? 'bg-yellow-100 text-yellow-800' :
                            cust.billingStatus === 'Overdue' ? 'bg-red-100 text-red-800' : ''
                          }`}>{cust.billingStatus}</span>
                        </td>
                        <td className="py-2 px-4">
                          <button onClick={() => openCustomerModal(cust)} className="bg-gray-300 text-gray-800 min-w-[70px] px-3 py-1 rounded hover:bg-gray-400 text-xs">View</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* View Modal */}
            {showCustomerModal && selectedCustomer && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  <h2 className="text-lg font-bold mb-4">Customer Details</h2>
                  <div className="mb-2"><b>Name:</b> {selectedCustomer.name}</div>
                  <div className="mb-2"><b>Account Number:</b> {formatAccountNumber(selectedCustomer.accountNumber)}</div>
                  <div className="mb-2"><b>Account Type:</b> {selectedCustomer.accountType}</div>
                  <div className="mb-2"><b>Address:</b> {selectedCustomer.address}</div>
                  <div className="mb-2"><b>Contact:</b> {selectedCustomer.contact}</div>
                  <div className="mb-2"><b>Email:</b> {selectedCustomer.email}</div>
                  <div className="mb-2"><b>Status:</b> {selectedCustomer.status}</div>
                  <div className="mb-2"><b>Billing Status (Current Month):</b> {selectedCustomer.billingStatus}</div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => setShowCustomerModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </BillHandlerLayout>
    </DynamicTitleLayout>
  );
};

export default BillHandlerCustomers; 
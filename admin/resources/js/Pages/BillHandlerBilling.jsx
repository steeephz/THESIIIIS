import React, { useState } from 'react';
import BillHandlerLayout from '@/Layouts/BillHandlerLayout';
import DynamicTitleLayout from '@/Layouts/DynamicTitleLayout';
import dayjs from 'dayjs';

const billingFeatures = [
  {
    key: 'bill-generation',
    title: 'Bill Payment Validation',
    description: 'Validate and confirm customer payments for generated bills.',
  },
  {
    key: 'billing-cycles',
    title: 'Billing Cycles',
    description: 'View and manage the billing cycle of each customer.',
  },
  {
    key: 'rate-management',
    title: 'Rate Management',
    description: 'Water rates, penalty rates, service charges',
  },
  {
    key: 'billing-history',
    title: 'Billing History',
    description: 'Track all generated bills by date/period',
  },
];

const mockBills = [
  { id: 1, customer: 'John Doe', accountNumber: '12001234', accountType: 'Residential', period: '2024-06', amount: 500, status: 'Pending Validation', paymentDate: '2024-06-10', paymentMethod: 'Online', reference: 'PMI1234567' },
  { id: 2, customer: 'Jane Smith', accountNumber: '23004567', accountType: 'Commercial', period: '2024-06', amount: 1500, status: 'Unpaid', paymentDate: '', paymentMethod: '', reference: '' },
  { id: 3, customer: 'Gov Office', accountNumber: '31006789', accountType: 'Government', period: '2024-06', amount: 800, status: 'Confirmed', paymentDate: '2024-06-09', paymentMethod: 'Cash', reference: 'PMI7654321' },
  { id: 4, customer: 'Mary Ann', accountNumber: '45001234', accountType: 'Residential', period: '2024-06', amount: 700, status: 'Rejected', paymentDate: '2024-06-08', paymentMethod: 'Online', reference: 'PMI1111222' },
];

const mockCycles = [
  {
    id: 1,
    customer: 'John Doe',
    accountNumber: '12001234',
    accountType: 'Residential',
    billingPeriod: '2024-06',
    cycleDate: '2024-06-01',
    meterReadingDate: '2024-06-01',
    prevReading: 100,
    currReading: 120,
    consumption: 20,
    rate: 25,
    totalAmount: 500,
    billGenerated: '2024-06-02',
    dueDate: '2024-06-15',
    paymentStatus: 'Unpaid',
    remarks: 'No issues',
  },
  {
    id: 2,
    customer: 'Jane Smith',
    accountNumber: '23004567',
    accountType: 'Commercial',
    billingPeriod: '2024-06',
    cycleDate: '2024-06-01',
    meterReadingDate: '2024-06-01',
    prevReading: 200,
    currReading: 250,
    consumption: 50,
    rate: 30,
    totalAmount: 1500,
    billGenerated: '2024-06-02',
    dueDate: '2024-06-15',
    paymentStatus: 'Paid',
    remarks: 'Paid on time',
  },
  {
    id: 3,
    customer: 'Gov Office',
    accountNumber: '31006789',
    accountType: 'Government',
    billingPeriod: '2024-06',
    cycleDate: '2024-06-01',
    meterReadingDate: '2024-06-01',
    prevReading: 300,
    currReading: 320,
    consumption: 20,
    rate: 40,
    totalAmount: 800,
    billGenerated: '2024-06-02',
    dueDate: '2024-06-15',
    paymentStatus: 'Unpaid',
    remarks: '',
  },
];

const mockHistory = [
  {
    id: 1,
    customer: 'John Doe',
    accountNumber: '12001234',
    accountType: 'Residential',
    billingPeriod: '2024-06',
    billDate: '2024-06-02',
    dueDate: '2024-06-15',
    amount: 500,
    paymentStatus: 'Unpaid',
    paymentDate: '',
    paymentMethod: '',
    reference: '',
    remarks: 'No issues',
  },
  {
    id: 2,
    customer: 'Jane Smith',
    accountNumber: '23004567',
    accountType: 'Commercial',
    billingPeriod: '2024-06',
    billDate: '2024-06-02',
    dueDate: '2024-06-15',
    amount: 1500,
    paymentStatus: 'Paid',
    paymentDate: '2024-06-10',
    paymentMethod: 'Online',
    reference: 'PMI1234567',
    remarks: 'Paid on time',
  },
  {
    id: 3,
    customer: 'Gov Office',
    accountNumber: '31006789',
    accountType: 'Government',
    billingPeriod: '2024-05',
    billDate: '2024-05-02',
    dueDate: '2024-05-15',
    amount: 800,
    paymentStatus: 'Paid',
    paymentDate: '2024-05-10',
    paymentMethod: 'Cash',
    reference: 'PMI7654321',
    remarks: '',
  },
];

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

const cycleReasons = [
  'System Maintenance or Downtime',
  'Customer-Requested Adjustment',
  'New Connection or Account Transfer',
  'Other',
];

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return dayjs(dateStr).format('MM-DD-YYYY');
}

const BillHandlerBilling = () => {
  const [activeTab, setActiveTab] = useState(billingFeatures[0].key);
  const [accountType, setAccountType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [billingPeriod, setBillingPeriod] = useState('2024-06');
  const [statusFilter, setStatusFilter] = useState('All');
  const [bills, setBills] = useState(mockBills);

  const [cycleAccountType, setCycleAccountType] = useState('All');
  const [cyclePeriod, setCyclePeriod] = useState('2024-06');
  const [cycles, setCycles] = useState(mockCycles);
  const [cycleSearch, setCycleSearch] = useState('');
  const [showCycleModal, setShowCycleModal] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [newCyclePeriod, setNewCyclePeriod] = useState('');
  const [cycleReason, setCycleReason] = useState(cycleReasons[0]);
  const [newRemarks, setNewRemarks] = useState('');

  const [historyAccountType, setHistoryAccountType] = useState('All');
  const [historyPeriod, setHistoryPeriod] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [history, setHistory] = useState(mockHistory);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const [customerAccountType, setCustomerAccountType] = useState('All');
  const [customerSearch, setCustomerSearch] = useState('');
  const [customers, setCustomers] = useState(mockCustomers);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const currentFeature = billingFeatures.find(f => f.key === activeTab);

  // Filter bills based on account type, search, period, and status
  const filteredBills = bills.filter(bill => {
    const matchesType = accountType === 'All' || bill.accountType === accountType;
    const matchesSearch =
      bill.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatAccountNumber(bill.accountNumber).includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || bill.status === statusFilter;
    const matchesPeriod = billingPeriod === '' || bill.period === billingPeriod;
    return matchesType && matchesSearch && matchesStatus && matchesPeriod;
  });

  const filteredCycles = cycles.filter(cycle => {
    const matchesType = cycleAccountType === 'All' || cycle.accountType === cycleAccountType;
    const matchesPeriod = cyclePeriod === '' || cycle.billingPeriod === cyclePeriod;
    const matchesSearch =
      cycle.customer.toLowerCase().includes(cycleSearch.toLowerCase()) ||
      formatAccountNumber(cycle.accountNumber).includes(cycleSearch);
    return matchesType && matchesPeriod && matchesSearch;
  });

  const filteredHistory = history.filter(row => {
    const matchesType = historyAccountType === 'All' || row.accountType === historyAccountType;
    const matchesPeriod = historyPeriod === '' || row.billingPeriod === historyPeriod;
    const matchesSearch =
      row.customer.toLowerCase().includes(historySearch.toLowerCase()) ||
      formatAccountNumber(row.accountNumber).includes(historySearch);
    return matchesType && matchesPeriod && matchesSearch;
  });

  const filteredCustomers = customers.filter(cust => {
    const matchesType = customerAccountType === 'All' || cust.accountType === customerAccountType;
    const matchesSearch =
      cust.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      formatAccountNumber(cust.accountNumber).includes(customerSearch);
    return matchesType && matchesSearch;
  });

  // Actions
  const handleConfirm = (id) => {
    if (window.confirm('Are you sure you want to confirm this payment?')) {
      setBills(bills.map(bill => bill.id === id ? { ...bill, status: 'Confirmed' } : bill));
    }
  };
  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this payment?')) {
      setBills(bills.map(bill => bill.id === id ? { ...bill, status: 'Rejected' } : bill));
    }
  };

  // Count for summary
  const pendingCount = bills.filter(b => b.status === 'Pending Validation').length;
  const unpaidCount = bills.filter(b => b.status === 'Unpaid').length;

  function openCycleModal(cycle) {
    setSelectedCycle(cycle);
    setNewCyclePeriod(cycle.billingPeriod);
    setCycleReason(cycleReasons[0]);
    setShowCycleModal(true);
  }
  function openRemarksModal(cycle) {
    setSelectedCycle(cycle);
    setNewRemarks(cycle.remarks || '');
    setShowRemarksModal(true);
  }
  function handleCycleChange() {
    setCycles(cycles.map(c => c.id === selectedCycle.id ? { ...c, billingPeriod: newCyclePeriod, remarks: (c.remarks ? c.remarks + '\n' : '') + `Cycle changed: ${cycleReason}` } : c));
    setShowCycleModal(false);
  }
  function handleRemarksSave() {
    setCycles(cycles.map(c => c.id === selectedCycle.id ? { ...c, remarks: newRemarks } : c));
    setShowRemarksModal(false);
  }

  function openHistoryModal(row) {
    setSelectedHistory(row);
    setShowHistoryModal(true);
  }

  function openCustomerModal(cust) {
    setSelectedCustomer(cust);
    setShowCustomerModal(true);
  }

  return (
    <DynamicTitleLayout userRole="bill handler">
      <BillHandlerLayout>
        <div className="max-w-full mx-auto p-2 sm:p-4 lg:p-6">
          <h1 className="text-2xl font-bold mb-6">Billing Management</h1>
          <div className="bg-white rounded-xl shadow-md p-2 sm:p-4 lg:p-6">
            {/* Tabs */}
            <div className="flex border-b mb-6">
              {billingFeatures.map(feature => (
                <button
                  key={feature.key}
                  className={`px-4 py-2 font-medium focus:outline-none transition-colors ${
                    activeTab === feature.key
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                  onClick={() => setActiveTab(feature.key)}
                >
                  {feature.title}
                </button>
              ))}
            </div>
            {/* Tab Content */}
            {activeTab === 'bill-generation' ? (
              <div className="py-8">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Billing Period</label>
                    <input
                      type="month"
                      value={billingPeriod}
                      onChange={e => setBillingPeriod(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                    <select
                      value={accountType}
                      onChange={e => setAccountType(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="All">All</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Residential">Residential</option>
                      <option value="Government">Government</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="All">All</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Pending Validation">Pending Validation</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Search by name or account number"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                {/* Bills Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left border">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 font-semibold">Customer</th>
                        <th className="py-2 px-4 font-semibold">Account Number</th>
                        <th className="py-2 px-4 font-semibold">Type</th>
                        <th className="py-2 px-4 font-semibold">Period</th>
                        <th className="py-2 px-4 font-semibold">Amount</th>
                        <th className="py-2 px-4 font-semibold">Payment Status</th>
                        <th className="py-2 px-4 font-semibold">Payment Date</th>
                        <th className="py-2 px-4 font-semibold">Method</th>
                        <th className="py-2 px-4 font-semibold">Reference</th>
                        <th className="py-2 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBills.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="py-4 text-center text-gray-500">No bills found</td>
                        </tr>
                      ) : (
                        filteredBills.map(bill => (
                          <tr key={bill.id} className="border-b">
                            <td className="py-2 px-4">{bill.customer}</td>
                            <td className="py-2 px-4">{formatAccountNumber(bill.accountNumber)}</td>
                            <td className="py-2 px-4">{bill.accountType}</td>
                            <td className="py-2 px-4">{bill.period}</td>
                            <td className="py-2 px-4">₱{bill.amount.toLocaleString()}</td>
                            <td className="py-2 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                bill.status === 'Pending Validation' ? 'bg-yellow-100 text-yellow-800' :
                                bill.status === 'Unpaid' ? 'bg-gray-100 text-gray-800' :
                                bill.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                bill.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''
                              }`}>{bill.status}</span>
                            </td>
                            <td className="py-2 px-4">{bill.paymentDate || '-'}</td>
                            <td className="py-2 px-4">{bill.paymentMethod || '-'}</td>
                            <td className="py-2 px-4">{bill.reference || '-'}</td>
                            <td className="py-2 px-4">
                              <div className="flex gap-2 flex-wrap">
                                {bill.status === 'Pending Validation' && (
                                  <>
                                    <button onClick={() => handleConfirm(bill.id)} className="bg-green-600 text-white min-w-[80px] px-3 py-1 rounded hover:bg-green-700 text-xs">Confirm</button>
                                    <button onClick={() => handleReject(bill.id)} className="bg-red-600 text-white min-w-[80px] px-3 py-1 rounded hover:bg-red-700 text-xs">Reject</button>
                                    <button className="bg-gray-300 text-gray-800 min-w-[80px] px-3 py-1 rounded hover:bg-gray-400 text-xs">View</button>
                                  </>
                                )}
                                {bill.status === 'Unpaid' && (
                                  <span className="text-xs text-gray-400 min-w-[80px] inline-block text-center">No action</span>
                                )}
                                {(bill.status === 'Confirmed' || bill.status === 'Rejected') && (
                                  <button className="bg-gray-300 text-gray-800 min-w-[80px] px-3 py-1 rounded hover:bg-gray-400 text-xs">View</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 gap-3">
                  <div className="text-gray-700 text-sm">{pendingCount} payments pending validation, {unpaidCount} unpaid bills.</div>
                </div>
                {/* Help/Instructions */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mt-6">
                  <h4 className="font-semibold mb-1">How to validate payments</h4>
                  <ul className="list-disc list-inside text-sm text-blue-900">
                    <li>Filter by period, account type, status, or search for a customer.</li>
                    <li>Review payment details for each bill.</li>
                    <li>Click <b>Confirm</b> to validate a payment, or <b>Reject</b> if invalid.</li>
                    <li>Use <b>View</b> to see more payment details if needed.</li>
                  </ul>
                </div>
              </div>
            ) : activeTab === 'billing-cycles' ? (
              <div className="py-8">
                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                    <select
                      value={cycleAccountType}
                      onChange={e => setCycleAccountType(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="All">All</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Residential">Residential</option>
                      <option value="Government">Government</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Billing Period</label>
                    <input
                      type="month"
                      value={cyclePeriod}
                      onChange={e => setCyclePeriod(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                      type="text"
                      value={cycleSearch}
                      onChange={e => setCycleSearch(e.target.value)}
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
                        <th className="py-2 px-4 font-semibold">Customer</th>
                        <th className="py-2 px-4 font-semibold">Account Number</th>
                        <th className="py-2 px-4 font-semibold">Account Type</th>
                        <th className="py-2 px-4 font-semibold">Billing Period</th>
                        <th className="py-2 px-4 font-semibold">Cycle Date</th>
                        <th className="py-2 px-4 font-semibold">Meter Reading Date</th>
                        <th className="py-2 px-4 font-semibold">Previous Reading</th>
                        <th className="py-2 px-4 font-semibold">Current Reading</th>
                        <th className="py-2 px-4 font-semibold">Consumption</th>
                        <th className="py-2 px-4 font-semibold">Total Amount</th>
                        <th className="py-2 px-4 font-semibold">Bill Generated</th>
                        <th className="py-2 px-4 font-semibold">Due Date</th>
                        <th className="py-2 px-4 font-semibold">Payment Status</th>
                        <th className="py-2 px-4 font-semibold">Remarks</th>
                        <th className="py-2 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCycles.length === 0 ? (
                        <tr>
                          <td colSpan={15} className="py-4 text-center text-gray-500">No billing cycles found</td>
                        </tr>
                      ) : (
                        filteredCycles.map(cycle => (
                          <tr key={cycle.id} className="border-b">
                            <td className="py-2 px-4">{cycle.customer}</td>
                            <td className="py-2 px-4">{formatAccountNumber(cycle.accountNumber)}</td>
                            <td className="py-2 px-4">{cycle.accountType}</td>
                            <td className="py-2 px-4">{cycle.billingPeriod}</td>
                            <td className="py-2 px-4">{formatDate(cycle.cycleDate)}</td>
                            <td className="py-2 px-4">{formatDate(cycle.meterReadingDate)}</td>
                            <td className="py-2 px-4">{cycle.prevReading}</td>
                            <td className="py-2 px-4">{cycle.currReading}</td>
                            <td className="py-2 px-4">{cycle.consumption}</td>
                            <td className="py-2 px-4">₱{cycle.totalAmount.toLocaleString()}</td>
                            <td className="py-2 px-4">{formatDate(cycle.billGenerated)}</td>
                            <td className="py-2 px-4">{formatDate(cycle.dueDate)}</td>
                            <td className="py-2 px-4">{cycle.paymentStatus}</td>
                            <td className="py-2 px-4 whitespace-pre-line">{cycle.remarks}</td>
                            <td className="py-2 px-4">
                              <div className="flex gap-2 flex-wrap">
                                <button onClick={() => openCycleModal(cycle)} className="bg-blue-600 text-white min-w-[90px] px-3 py-1 rounded hover:bg-blue-700 text-xs">Change Cycle</button>
                                <button onClick={() => openRemarksModal(cycle)} className="bg-gray-300 text-gray-800 min-w-[90px] px-3 py-1 rounded hover:bg-gray-400 text-xs">Edit Remarks</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Change Cycle Modal */}
                {showCycleModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                      <h2 className="text-lg font-bold mb-4">Change Billing Cycle</h2>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Billing Period Date</label>
                        <input
                          type="date"
                          value={newCyclePeriod}
                          onChange={e => setNewCyclePeriod(e.target.value)}
                          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <select
                          value={cycleReason}
                          onChange={e => setCycleReason(e.target.value)}
                          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {cycleReasons.map(reason => (
                            <option key={reason} value={reason}>{reason}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setShowCycleModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                        <button onClick={handleCycleChange} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Edit Remarks Modal */}
                {showRemarksModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                      <h2 className="text-lg font-bold mb-4">Edit Remarks</h2>
                      <textarea
                        value={newRemarks}
                        onChange={e => setNewRemarks(e.target.value)}
                        rows={4}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setShowRemarksModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                        <button onClick={handleRemarksSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'billing-history' ? (
              <div className="py-8">
                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                    <select
                      value={historyAccountType}
                      onChange={e => setHistoryAccountType(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="All">All</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Residential">Residential</option>
                      <option value="Government">Government</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Billing Period</label>
                    <input
                      type="month"
                      value={historyPeriod}
                      onChange={e => setHistoryPeriod(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                      type="text"
                      value={historySearch}
                      onChange={e => setHistorySearch(e.target.value)}
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
                        <th className="py-2 px-4 font-semibold">Customer</th>
                        <th className="py-2 px-4 font-semibold">Account Number</th>
                        <th className="py-2 px-4 font-semibold">Account Type</th>
                        <th className="py-2 px-4 font-semibold">Billing Period</th>
                        <th className="py-2 px-4 font-semibold">Bill Date</th>
                        <th className="py-2 px-4 font-semibold">Due Date</th>
                        <th className="py-2 px-4 font-semibold">Amount</th>
                        <th className="py-2 px-4 font-semibold">Payment Status</th>
                        <th className="py-2 px-4 font-semibold">Payment Date</th>
                        <th className="py-2 px-4 font-semibold">Method</th>
                        <th className="py-2 px-4 font-semibold">Reference</th>
                        <th className="py-2 px-4 font-semibold">Remarks</th>
                        <th className="py-2 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.length === 0 ? (
                        <tr>
                          <td colSpan={13} className="py-4 text-center text-gray-500">No billing history found</td>
                        </tr>
                      ) : (
                        filteredHistory.map(row => (
                          <tr key={row.id} className="border-b">
                            <td className="py-2 px-4">{row.customer}</td>
                            <td className="py-2 px-4">{formatAccountNumber(row.accountNumber)}</td>
                            <td className="py-2 px-4">{row.accountType}</td>
                            <td className="py-2 px-4">{row.billingPeriod}</td>
                            <td className="py-2 px-4">{formatDate(row.billDate)}</td>
                            <td className="py-2 px-4">{formatDate(row.dueDate)}</td>
                            <td className="py-2 px-4">₱{row.amount.toLocaleString()}</td>
                            <td className="py-2 px-4">{row.paymentStatus}</td>
                            <td className="py-2 px-4">{formatDate(row.paymentDate)}</td>
                            <td className="py-2 px-4">{row.paymentMethod || '-'}</td>
                            <td className="py-2 px-4">{row.reference || '-'}</td>
                            <td className="py-2 px-4 whitespace-pre-line">{row.remarks}</td>
                            <td className="py-2 px-4">
                              <button onClick={() => openHistoryModal(row)} className="bg-gray-300 text-gray-800 min-w-[70px] px-3 py-1 rounded hover:bg-gray-400 text-xs">View</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {/* View Modal */}
                {showHistoryModal && selectedHistory && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                      <h2 className="text-lg font-bold mb-4">Billing Details</h2>
                      <div className="mb-2"><b>Customer:</b> {selectedHistory.customer}</div>
                      <div className="mb-2"><b>Account Number:</b> {formatAccountNumber(selectedHistory.accountNumber)}</div>
                      <div className="mb-2"><b>Account Type:</b> {selectedHistory.accountType}</div>
                      <div className="mb-2"><b>Billing Period:</b> {selectedHistory.billingPeriod}</div>
                      <div className="mb-2"><b>Bill Date:</b> {formatDate(selectedHistory.billDate)}</div>
                      <div className="mb-2"><b>Due Date:</b> {formatDate(selectedHistory.dueDate)}</div>
                      <div className="mb-2"><b>Amount:</b> ₱{selectedHistory.amount.toLocaleString()}</div>
                      <div className="mb-2"><b>Payment Status:</b> {selectedHistory.paymentStatus}</div>
                      <div className="mb-2"><b>Payment Date:</b> {formatDate(selectedHistory.paymentDate)}</div>
                      <div className="mb-2"><b>Method:</b> {selectedHistory.paymentMethod || '-'}</div>
                      <div className="mb-2"><b>Reference:</b> {selectedHistory.reference || '-'}</div>
                      <div className="mb-2"><b>Remarks:</b> <span className="whitespace-pre-line">{selectedHistory.remarks}</span></div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => setShowHistoryModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Close</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'customers' ? (
              <div className="py-8">
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
            ) : (
              <div className="py-8 text-center">
                <h2 className="text-xl font-semibold mb-2">{currentFeature.title}</h2>
                <p className="text-gray-600 text-lg">{currentFeature.description}</p>
              </div>
            )}
          </div>
        </div>
      </BillHandlerLayout>
    </DynamicTitleLayout>
  );
};

export default BillHandlerBilling; 
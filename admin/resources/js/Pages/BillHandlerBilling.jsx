import React, { useState, useEffect } from 'react';
import BillHandlerLayout from '@/Layouts/BillHandlerLayout';
import DynamicTitleLayout from '@/Layouts/DynamicTitleLayout';
import dayjs from 'dayjs';

const billingFeatures = [
  {
    key: 'invoice-generation',
    title: 'Invoice Generation',
    description: 'Generate invoices for customers based on their meter readings and consumption.',
  },
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
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const [cycleAccountType, setCycleAccountType] = useState('All');
  const [cyclePeriod, setCyclePeriod] = useState('');
  const [cycles, setCycles] = useState([]);
  const [cycleSearch, setCycleSearch] = useState('');
  const [cycleLoading, setCycleLoading] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [showCycleDetailsModal, setShowCycleDetailsModal] = useState(false);

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

  const [showBillDetailsModal, setShowBillDetailsModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Invoice Generation states (simplified meter readings)
  const [meterReadings, setMeterReadings] = useState([]);
  const [readingSearch, setReadingSearch] = useState('');
  const [readingStatusFilter, setReadingStatusFilter] = useState('All');
  const [readingLoading, setReadingLoading] = useState(false);
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [selectedReading, setSelectedReading] = useState(null);
  const [selectedReadings, setSelectedReadings] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [loadingInvoiceId, setLoadingInvoiceId] = useState(null);

  const currentFeature = billingFeatures.find(f => f.key === activeTab);

  // Fetch bills from API (moved outside useEffect for reuse)
  const fetchBills = async () => {
    setLoading(true);
    try {
      let url = '/api/bill-payment-validation?';
      url += `account_type=${accountType}&status=${statusFilter}&period=${billingPeriod}&search=${searchTerm}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBills(Array.isArray(data) ? data : []);
      } else {
        setBills([]);
      }
    } catch (err) {
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch meter readings from API (simplified)
  const fetchMeterReadings = async () => {
    setReadingLoading(true);
    try {
      const response = await fetch('/api/meter-readings');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Meter readings data:', data);
        setMeterReadings(Array.isArray(data) ? data : []);
      } else {
        console.error('HTTP error:', response.status, response.statusText);
        setMeterReadings([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setMeterReadings([]);
    } finally {
      setReadingLoading(false);
    }
  };

  // Fetch billing cycles from API
  const fetchBillingCycles = async () => {
    setCycleLoading(true);
    try {
      // First, automatically sync all customers to billing cycles
      const syncResponse = await fetch('/api/billing-cycles/create-for-all-customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });

      if (syncResponse.ok) {
        const syncResult = await syncResponse.json();
        console.log('Auto-sync result:', syncResult);
      }

      // Then fetch the billing cycles
      let url = '/api/billing-cycles?';
      const params = new URLSearchParams({
        account_type: cycleAccountType,
        billing_period: cyclePeriod,
        search: cycleSearch
      });
      url += params.toString();

      const response = await fetch(url);
      console.log('Billing cycles response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Billing cycles data:', data);
        setCycles(Array.isArray(data) ? data : []);
      } else {
        console.error('HTTP error:', response.status, response.statusText);
        setCycles([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setCycles([]);
    } finally {
      setCycleLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
    // eslint-disable-next-line
  }, [accountType, statusFilter, billingPeriod, searchTerm]);

  useEffect(() => {
    if (activeTab === 'invoice-generation') {
      fetchMeterReadings();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'invoice-generation') {
      fetchMeterReadings();
    }
    // eslint-disable-next-line
  }, [readingSearch, readingStatusFilter]);

  useEffect(() => {
    if (activeTab === 'billing-cycles') {
      fetchBillingCycles();
    }
    // eslint-disable-next-line
  }, [activeTab, cycleAccountType, cyclePeriod, cycleSearch]);

  // Defensive rendering for bills
  if (loading) {
    return <div className="w-full text-center py-10 text-lg font-semibold text-blue-600">Loading billing data...</div>;
  }
  if (!Array.isArray(bills)) {
    return <div>Error: Bills data is not an array.</div>;
  }

  // Filter bills based on account type, search, period, and status
  const filteredBills = bills.filter(bill => {
    const matchesType = accountType === 'All' || bill.account_type === accountType;
    const matchesSearch =
      bill.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatAccountNumber(bill.account_number).includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || bill.status === statusFilter;
    const matchesPeriod = billingPeriod === '' || bill.period === billingPeriod;
    return matchesType && matchesSearch && matchesStatus && matchesPeriod;
  });

  const filteredCycles = cycles.filter(cycle => {
    const matchesType = cycleAccountType === 'All' || cycle.account_type === cycleAccountType;
    const matchesPeriod = cyclePeriod === '' || (cycle.billing_start_date && cycle.billing_start_date.slice(0, 7) === cyclePeriod);
    const matchesSearch =
      (cycle.customer && cycle.customer.toLowerCase().includes(cycleSearch.toLowerCase())) ||
      (cycle.account_number && formatAccountNumber(cycle.account_number).includes(cycleSearch));
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

  // Filter meter readings based on search and staff
  const filteredMeterReadings = meterReadings.filter(reading => {
    const matchesSearch = !readingSearch || 
      reading.meter_number?.toLowerCase().includes(readingSearch.toLowerCase()) ||
      reading.id?.toString().includes(readingSearch) ||
      reading.remarks?.toLowerCase().includes(readingSearch.toLowerCase()) ||
      reading.staff_id?.toString().includes(readingSearch);
    const matchesStaff = readingStatusFilter === 'All' || reading.staff_id?.toString() === readingStatusFilter;
    return matchesSearch && matchesStaff;
  });

  // Actions
  const handleConfirm = async (id) => {
    if (window.confirm('Are you sure you want to confirm this payment?')) {
      console.log('Sending PATCH request for id:', id);
      // Get CSRF cookie first
      await fetch('/sanctum/csrf-cookie', { credentials: 'include' });
      const response = await fetch(`/api/bill-payment-validation/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'Confirmed' })
      });
      console.log('PATCH response status:', response.status);
      if (response.ok) {
        fetchBills();
      } else {
        let error = '';
        try {
          error = await response.json();
        } catch (e) {
          error = response.statusText;
        }
        alert('Failed to confirm: ' + (error.message || response.status));
        console.error('API error:', error);
      }
    }
  };
  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this payment?')) {
      console.log('Sending PATCH request for id:', id);
      // Get CSRF cookie first
      await fetch('/sanctum/csrf-cookie', { credentials: 'include' });
      const response = await fetch(`/api/bill-payment-validation/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'Rejected' })
      });
      console.log('PATCH response status:', response.status);
      if (response.ok) {
        fetchBills();
      } else {
        let error = '';
        try {
          error = await response.json();
        } catch (e) {
          error = response.statusText;
        }
        alert('Failed to reject: ' + (error.message || response.status));
        console.error('API error:', error);
      }
    }
  };

  // Count for summary
  const pendingCount = bills.filter(b => b.status === 'Pending Validation').length;
  const unpaidCount = bills.filter(b => b.status === 'Unpaid').length;

  function openHistoryModal(row) {
    setSelectedHistory(row);
    setShowHistoryModal(true);
  }

  function openCustomerModal(cust) {
    setSelectedCustomer(cust);
    setShowCustomerModal(true);
  }

  function openBillDetailsModal(bill) {
    setSelectedBill(bill);
    setShowBillDetailsModal(true);
  }

  function openCycleDetailsModal(cycle) {
    setSelectedCycle(cycle);
    setShowCycleDetailsModal(true);
  }

  function openReadingModal(reading) {
    setSelectedReading(reading);
    setShowReadingModal(true);
  }

  function handleSelectReading(readingId) {
    setSelectedReadings(prev => {
      if (prev.includes(readingId)) {
        return prev.filter(id => id !== readingId);
      } else {
        return [...prev, readingId];
      }
    });
  }

  function handleSelectAllReadings() {
    if (selectedReadings.length === filteredMeterReadings.length) {
      setSelectedReadings([]);
    } else {
      setSelectedReadings(filteredMeterReadings.map(r => r.id));
    }
  }

  function handleGenerateInvoicesFromReadings() {
    if (selectedReadings.length === 0) {
      alert('Please select at least one meter reading to generate invoices.');
      return;
    }
    if (window.confirm(`Generate invoices for ${selectedReadings.length} selected meter readings?`)) {
      // TODO: Implement bulk invoice generation from meter readings
      console.log('Generating invoices for readings:', selectedReadings);
      alert('Bulk invoice generation functionality will be implemented.');
      setSelectedReadings([]);
    }
  }

  // Generate invoice for single meter reading
  async function handleGenerateInvoice(readingId) {
    setLoadingInvoiceId(readingId);
    try {
      console.log('Generating invoice for reading ID:', readingId);
      const response = await fetch(`/api/meter-readings/${readingId}/with-customer`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Invoice data:', data);
        setInvoiceData(data);
        setShowInvoiceModal(true);
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        alert(`Failed to fetch customer data. Status: ${response.status}. Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Error generating invoice. Please try again.');
    } finally {
      setLoadingInvoiceId(null);
    }
  }

  // Format date for invoice
  function formatInvoiceDate(dateStr) {
    if (!dateStr) return new Date().toLocaleDateString();
    return new Date(dateStr).toLocaleDateString();
  }

  // Generate invoice number
  function generateInvoiceNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}${day}-${random}`;
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
            {activeTab === 'invoice-generation' ? (
              <div className="py-8">
                {/* Search and Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                      type="text"
                      value={readingSearch}
                      onChange={e => setReadingSearch(e.target.value)}
                      placeholder="Search by ID, meter number, remarks, or staff ID"
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Staff Filter</label>
                    <select
                      value={readingStatusFilter}
                      onChange={e => setReadingStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="All">All Staff</option>
                      {[...new Set(meterReadings.map(r => r.staff_id).filter(Boolean))].map(staffId => (
                        <option key={staffId} value={staffId}>Staff {staffId}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-4 text-left">ID</th>
                        <th className="py-2 px-4 text-left">Meter Number</th>
                        <th className="py-2 px-4 text-left">Reading Value</th>
                        <th className="py-2 px-4 text-left">Amount</th>
                        <th className="py-2 px-4 text-left">Remarks</th>
                        <th className="py-2 px-4 text-left">Staff ID</th>
                        <th className="py-2 px-4 text-left">Reading Date</th>
                        <th className="py-2 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMeterReadings.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-4 text-center text-gray-500">No meter readings found</td>
                        </tr>
                      ) : (
                        filteredMeterReadings.map(reading => (
                          <tr key={reading.id} className="border-b">
                            <td className="py-2 px-4">{reading.id}</td>
                            <td className="py-2 px-4">{reading.meter_number}</td>
                            <td className="py-2 px-4">{reading.reading_value}</td>
                            <td className="py-2 px-4">₱{reading.amount}</td>
                            <td className="py-2 px-4">{reading.remarks}</td>
                            <td className="py-2 px-4">{reading.staff_id}</td>
                            <td className="py-2 px-4">{formatDate(reading.reading_date)}</td>
                            <td className="py-2 px-4">
                              <button
                                onClick={() => openReadingModal(reading)}
                                className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 text-xs mr-2"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleGenerateInvoice(reading)}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                              >
                                Generate Invoice
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Meter Reading Details Modal */}
                {showReadingModal && selectedReading && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                      <h2 className="text-lg font-bold mb-4">Meter Reading Details</h2>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="mb-2"><b>ID:</b> {selectedReading.id}</div>
                        <div className="mb-2"><b>Meter Number:</b> {selectedReading.meter_number}</div>
                        <div className="mb-2"><b>Reading Value:</b> {selectedReading.reading_value}</div>
                        <div className="mb-2"><b>Amount:</b> ₱{selectedReading.amount}</div>
                        <div className="mb-2"><b>Reading Date:</b> {formatDate(selectedReading.reading_date)}</div>
                        <div className="mb-2"><b>Staff ID:</b> {selectedReading.staff_id}</div>
                        <div className="mb-2"><b>Remarks:</b> {selectedReading.remarks}</div>
                        <div className="mb-2"><b>Created At:</b> {formatDate(selectedReading.created_at)}</div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => setShowReadingModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Close</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Generate Invoice Modal */}
                {showInvoiceModal && selectedReading && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                      <div className="bg-blue-600 text-white p-6 text-center">
                        <h1 className="text-2xl font-bold">HERMOSA WATER DISTRICT</h1>
                        <h2 className="text-lg">WATER BILL INVOICE</h2>
                        <div className="mt-2 text-sm">
                          Invoice #: INV-{selectedReading.id} | Date: {formatDate(new Date())}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h3 className="text-lg font-semibold text-blue-600 mb-3">Meter Reading Information</h3>
                            <div className="space-y-2">
                              <div><strong>ID:</strong> {selectedReading.id}</div>
                              <div><strong>Meter Number:</strong> {selectedReading.meter_number}</div>
                              <div><strong>Reading Value:</strong> {selectedReading.reading_value}</div>
                              <div><strong>Amount:</strong> ₱{selectedReading.amount}</div>
                              <div><strong>Reading Date:</strong> {formatDate(selectedReading.reading_date)}</div>
                              <div><strong>Staff ID:</strong> {selectedReading.staff_id}</div>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-blue-600 mb-3">Breakdown</h3>
                            <div className="space-y-2">
                              <div><strong>Basic Charge:</strong> ₱30.00</div>
                              <div><strong>Usage Charge:</strong> ₱{selectedReading.amount}</div>
                              <div><strong>Other Fees:</strong> ₱0.00</div>
                              <div className="font-bold text-blue-700">Total: ₱{selectedReading.amount}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                        <button 
                          onClick={() => setShowInvoiceModal(false)} 
                          className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
                        >
                          Close
                        </button>
                        <button 
                          onClick={() => window.print()} 
                          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                          Print Invoice
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'bill-generation' ? (
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
                      <option value="Pending Validation">Pending Validation</option>
                      <option value="Unpaid">Unpaid</option>
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

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <h3 className="font-semibold text-yellow-800">Pending Validation</h3>
                    <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
                  </div>
                  <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
                    <h3 className="font-semibold text-gray-800">Unpaid Bills</h3>
                    <p className="text-2xl font-bold text-gray-900">{unpaidCount}</p>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-4 text-left">Customer</th>
                        <th className="py-2 px-4 text-left">Account Number</th>
                        <th className="py-2 px-4 text-left">Amount</th>
                        <th className="py-2 px-4 text-left">Status</th>
                        <th className="py-2 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBills.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-gray-500">No bills found</td>
                        </tr>
                      ) : (
                        filteredBills.map(bill => (
                          <tr key={bill.id} className="border-b">
                            <td className="py-2 px-4">{bill.customer}</td>
                            <td className="py-2 px-4">{formatAccountNumber(bill.account_number)}</td>
                            <td className="py-2 px-4">₱{bill.amount?.toLocaleString()}</td>
                            <td className="py-2 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                bill.status === 'Pending Validation' ? 'bg-yellow-100 text-yellow-800' :
                                bill.status === 'Unpaid' ? 'bg-gray-100 text-gray-800' :
                                bill.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                bill.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''
                              }`}>{bill.status}</span>
                            </td>
                            <td className="py-2 px-4">
                              <div className="flex gap-2 min-w-[180px]">
                                {bill.status === 'Pending Validation' ? (
                                  <>
                                    <button
                                      onClick={() => handleConfirm(bill.id)}
                                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => handleReject(bill.id)}
                                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                                    >
                                      Reject
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button className="invisible px-3 py-1 text-xs">Confirm</button>
                                    <button className="invisible px-3 py-1 text-xs">Reject</button>
                                  </>
                                )}
                                <button
                                  onClick={() => openBillDetailsModal(bill)}
                                  className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 text-xs"
                                >
                                  Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Bill Details Modal */}
                {showBillDetailsModal && selectedBill && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                      <h2 className="text-lg font-bold mb-4">Bill Details</h2>
                      <div className="mb-2"><b>Customer:</b> {selectedBill.customer}</div>
                      <div className="mb-2"><b>Account Number:</b> {formatAccountNumber(selectedBill.account_number)}</div>
                      <div className="mb-2"><b>Account Type:</b> {selectedBill.account_type}</div>
                      <div className="mb-2"><b>Period:</b> {selectedBill.period}</div>
                      <div className="mb-2"><b>Amount:</b> ₱{selectedBill.amount?.toLocaleString()}</div>
                      <div className="mb-2"><b>Status:</b> {selectedBill.status}</div>
                      <div className="mb-2"><b>Payment Date:</b> {selectedBill.payment_date || '-'}</div>
                      <div className="mb-2"><b>Payment Method:</b> {selectedBill.payment_method || '-'}</div>
                      <div className="mb-2"><b>Reference:</b> {selectedBill.reference || '-'}</div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => setShowBillDetailsModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Close</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'billing-cycles' ? (
              <div className="py-8">
                {/* Header with Generate Button */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Billing Cycles Management</h2>
                  <div className="text-sm text-gray-600">
                    Billing cycles are automatically synced from customer data
                  </div>
                </div>

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

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <h3 className="font-semibold text-blue-800">Total Cycles</h3>
                    <p className="text-2xl font-bold text-blue-900">{filteredCycles.length}</p>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                    <h3 className="font-semibold text-green-800">Active</h3>
                    <p className="text-2xl font-bold text-green-900">
                      {cycles.filter(c => c.status === 'active').length}
                    </p>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <h3 className="font-semibold text-yellow-800">Inactive</h3>
                    <p className="text-2xl font-bold text-yellow-900">
                      {cycles.filter(c => c.status === 'inactive').length}
                    </p>
                  </div>
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <h3 className="font-semibold text-red-800">Total Amount</h3>
                    <p className="text-2xl font-bold text-red-900">
                      ₱{cycles.reduce((sum, c) => sum + (parseFloat(c.amount_due) || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Loading or Table */}
                {cycleLoading ? (
                  <div className="text-center py-10 text-lg font-semibold text-blue-600">Loading billing cycles...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-2 px-4 text-left">Customer</th>
                          <th className="py-2 px-4 text-left">Account Number</th>
                          <th className="py-2 px-4 text-left">Account Type</th>
                          <th className="py-2 px-4 text-left">Billing Start Date</th>
                          <th className="py-2 px-4 text-left">Billing End Date</th>
                          <th className="py-2 px-4 text-left">Status</th>
                          <th className="py-2 px-4 text-left">Amount Due</th>
                          <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCycles.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-4 text-center text-gray-500">
                              {cycles.length === 0 ? 'No billing cycles found. Billing cycles are automatically created when you access this tab.' : 'No billing cycles match your filters.'}
                            </td>
                          </tr>
                        ) : (
                          filteredCycles.map(cycle => (
                            <tr key={cycle.id} className="border-b">
                              <td className="py-2 px-4">{cycle.customer}</td>
                              <td className="py-2 px-4">{cycle.account_number}</td>
                              <td className="py-2 px-4">{cycle.account_type}</td>
                              <td className="py-2 px-4">{formatDate(cycle.billing_start_date)}</td>
                              <td className="py-2 px-4">{formatDate(cycle.billing_end_date)}</td>
                              <td className="py-2 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  cycle.status === 'active' ? 'bg-green-100 text-green-800' :
                                  cycle.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>{cycle.status || 'active'}</span>
                              </td>
                              <td className="py-2 px-4">₱{parseFloat(cycle.amount_due || 0).toLocaleString()}</td>
                              <td className="py-2 px-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openCycleDetailsModal(cycle)}
                                    className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 text-xs"
                                  >
                                    Details
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Cycle Details Modal */}
                {showCycleDetailsModal && selectedCycle && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                      <h2 className="text-lg font-bold mb-4">Billing Cycle Details</h2>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="mb-2"><b>Customer:</b> {selectedCycle.customer}</div>
                        <div className="mb-2"><b>Account Number:</b> {selectedCycle.account_number}</div>
                        <div className="mb-2"><b>Account Type:</b> {selectedCycle.account_type}</div>
                        <div className="mb-2"><b>Billing Start Date:</b> {formatDate(selectedCycle.billing_start_date)}</div>
                        <div className="mb-2"><b>Billing End Date:</b> {formatDate(selectedCycle.billing_end_date)}</div>
                        <div className="mb-2"><b>Status:</b> {selectedCycle.status}</div>
                        <div className="mb-2"><b>Amount Due:</b> ₱{parseFloat(selectedCycle.amount_due || 0).toLocaleString()}</div>
                        <div className="mb-2"><b>Created:</b> {formatDate(selectedCycle.created_at)}</div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => setShowCycleDetailsModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Close</button>
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
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-4 text-left">Customer</th>
                        <th className="py-2 px-4 text-left">Account Number</th>
                        <th className="py-2 px-4 text-left">Billing Period</th>
                        <th className="py-2 px-4 text-left">Amount</th>
                        <th className="py-2 px-4 text-left">Due Date</th>
                        <th className="py-2 px-4 text-left">Status</th>
                        <th className="py-2 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-4 text-center text-gray-500">No billing history found</td>
                        </tr>
                      ) : (
                        filteredHistory.map(row => (
                          <tr key={row.id} className="border-b">
                            <td className="py-2 px-4">{row.customer}</td>
                            <td className="py-2 px-4">{formatAccountNumber(row.accountNumber)}</td>
                            <td className="py-2 px-4">{row.billingPeriod}</td>
                            <td className="py-2 px-4">₱{row.amount.toLocaleString()}</td>
                            <td className="py-2 px-4">{formatDate(row.dueDate)}</td>
                            <td className="py-2 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                row.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                                row.paymentStatus === 'Unpaid' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>{row.paymentStatus}</span>
                            </td>
                            <td className="py-2 px-4">
                              <button
                                onClick={() => openHistoryModal(row)}
                                className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 text-xs"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* History Details Modal */}
                {showHistoryModal && selectedHistory && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                      <h2 className="text-lg font-bold mb-4">Billing History Details</h2>
                      <div className="mb-2"><b>Customer:</b> {selectedHistory.customer}</div>
                      <div className="mb-2"><b>Account Number:</b> {formatAccountNumber(selectedHistory.accountNumber)}</div>
                      <div className="mb-2"><b>Account Type:</b> {selectedHistory.accountType}</div>
                      <div className="mb-2"><b>Billing Period:</b> {selectedHistory.billingPeriod}</div>
                      <div className="mb-2"><b>Bill Date:</b> {formatDate(selectedHistory.billDate)}</div>
                      <div className="mb-2"><b>Due Date:</b> {formatDate(selectedHistory.dueDate)}</div>
                      <div className="mb-2"><b>Amount:</b> ₱{selectedHistory.amount.toLocaleString()}</div>
                      <div className="mb-2"><b>Payment Status:</b> {selectedHistory.paymentStatus}</div>
                      <div className="mb-2"><b>Payment Date:</b> {formatDate(selectedHistory.paymentDate)}</div>
                      <div className="mb-2"><b>Payment Method:</b> {selectedHistory.paymentMethod || '-'}</div>
                      <div className="mb-2"><b>Reference:</b> {selectedHistory.reference || '-'}</div>
                      <div className="mb-2"><b>Remarks:</b> <span className="whitespace-pre-line">{selectedHistory.remarks || '-'}</span></div>
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
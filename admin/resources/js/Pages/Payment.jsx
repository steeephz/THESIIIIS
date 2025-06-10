import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import DynamicTitleLayout from '@/Layouts/DynamicTitleLayout';

const paymentData = [
  {
    id: 1,
    name: 'Liam Payne',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    amount: 344.00,
    status: 'Validated',
  },
  {
    id: 2,
    name: 'Carlos Sainz',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    amount: 243.00,
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Zayn Malik',
    avatar: 'https://randomuser.me/api/portraits/men/13.jpg',
    amount: 268.00,
    status: 'Validated',
  },
];

const summaryStats = [
  { label: 'Total Invoices', value: 168, icon: 'receipt_long', color: 'text-blue-600' },
  { label: 'Paid', value: 83, icon: 'check_circle', color: 'text-green-600' },
  { label: 'Unpaid', value: 85, icon: 'cancel', color: 'text-red-600' },
];

const statusColor = status => {
  if (status === 'Validated') return 'text-green-600';
  if (status === 'Pending') return 'text-gray-500';
  return 'text-red-600';
};

const Payment = () => {
    const [accountType, setAccountType] = useState('All');
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredPayments, setFilteredPayments] = useState([]);

    // Fetch all payments from the API
    useEffect(() => {
        fetchPayments();
    }, []);

    // Filter payments when accountType changes
    useEffect(() => {
        if (accountType === 'All') {
            setFilteredPayments(payments);
        } else {
            const filtered = payments.filter(payment => 
                payment.customer?.customer_type?.toLowerCase() === accountType.toLowerCase()
            );
            setFilteredPayments(filtered);
        }
    }, [accountType, payments]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/payments');
            setPayments(response.data);
            setFilteredPayments(response.data); // Initially show all payments
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprovePayment = async (paymentId) => {
        try {
            await axios.post(`/api/payments/${paymentId}/approve`);
            // Refresh payments after approval
            fetchPayments();
        } catch (error) {
            console.error('Error approving payment:', error);
        }
    };

    const getStatusColor = (status, paymentType) => {
        if (status === 'Approved') return 'text-green-600';
        if (status === 'Pending') return 'text-yellow-600';
        if (status === 'Verification_Failed') return 'text-red-600';
        if (paymentType === 'Partial') return 'text-orange-600';
        return 'text-gray-600';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <DynamicTitleLayout userRole="admin">
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
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h1 className="text-2xl font-semibold mb-6">Payment Management</h1>
                        
                        {/* Filter Section */}
                        <div className="flex items-center mb-6 bg-gray-50 p-4 rounded-lg">
                            <label htmlFor="accountType" className="mr-2 font-medium text-gray-700">Filter by Account Type:</label>
                            <select
                                id="accountType"
                                value={accountType}
                                onChange={e => setAccountType(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
                            >
                                <option value="All">All Accounts</option>
                                <option value="residential">Residential</option>
                                <option value="commercial">Commercial</option>
                                <option value="government">Government</option>
                            </select>
                            <span className="ml-4 text-sm text-gray-500">
                                Showing {filteredPayments.length} payments
                            </span>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-green-700">Total Payments</h3>
                                <p className="text-2xl font-bold text-green-800">
                                    ₱{filteredPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-blue-700">Pending Payments</h3>
                                <p className="text-2xl font-bold text-blue-800">
                                    {filteredPayments.filter(p => p.status === 'Pending').length}
                                </p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-orange-700">Partial Payments</h3>
                                <p className="text-2xl font-bold text-orange-800">
                                    {filteredPayments.filter(p => p.payment_type === 'Partial').length}
                                </p>
                            </div>
                        </div>

                        {/* Payments Table */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Details</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                                    <span className="ml-2">Loading payments...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredPayments.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                                No payments found for {accountType === 'All' ? 'any account type' : accountType + ' accounts'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredPayments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {payment.customer?.user?.name || 'N/A'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {payment.customer?.customer_type?.toUpperCase() || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        Acc#: {payment.account_number}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Meter#: {payment.meter_number}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        ₱{parseFloat(payment.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                    </div>
                                                    {payment.remaining_balance > 0 && (
                                                        <div className="text-xs text-red-500">
                                                            Remaining: ₱{parseFloat(payment.remaining_balance).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        payment.payment_type === 'Full' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-orange-100 text-orange-800'
                                                    }`}>
                                                        {payment.payment_type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-sm ${getStatusColor(payment.status, payment.payment_type)}`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(payment.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {payment.status === 'Pending' && (
                                                        <button
                                                            onClick={() => handleApprovePayment(payment.id)}
                                                            className="text-blue-600 hover:text-blue-900 mr-2"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => window.open(`/storage/${payment.proof_of_payment}`, '_blank')}
                                                        className="text-gray-600 hover:text-gray-900"
                                                    >
                                                        View Proof
                                                    </button>
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
        </DynamicTitleLayout>
    );
};

export default Payment; 
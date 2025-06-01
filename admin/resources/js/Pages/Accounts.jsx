import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';

const iconStyle = {
    cursor: 'pointer',
    margin: '0 6px',
    fontSize: '18px',
};

const Accounts = () => {
    const { auth } = usePage().props;
    const [profilePicture, setProfilePicture] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState('staff');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'admin',
        address: '',
        contact_number: '',
        email: '',
        employee_id: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('/api/admin/profile');
                if (response.data && response.data.profile_picture) {
                    setProfilePicture(response.data.profile_picture);
                }
            } catch (error) {
                // ignore error for now
            }
        };
        fetchProfileData();
        fetchAccounts();
    }, [activeTab, searchTerm]);

    const fetchAccounts = async () => {
        try {
            const response = await axios.get(`/api/accounts?type=${activeTab}&search=${searchTerm}`);
            if (response.data.success) {
                setAccounts(response.data.data.data);
            }
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = formType === 'staff' ? '/api/accounts/staff' : '/api/accounts/customer';
            
            // For staff accounts, include both username and name fields
            const dataToSubmit = formType === 'staff' 
                ? { ...formData, name: formData.username } // Use username as name for staff
                : formData;
            
            const response = await axios.post(endpoint, dataToSubmit);
            
            if (response.data.success) {
                // Reset form and close modal
                setShowForm(false);
                setFormData({
                    username: '',
                    password: '',
                    role: 'admin',
                    address: '',
                    contact_number: '',
                    email: '',
                    employee_id: ''
                });
                
                // Refresh the accounts list
                fetchAccounts();
                
                // Show success message
                alert('Account created successfully!');
            }
        } catch (error) {
            console.error('Error creating account:', error);
            alert(error.response?.data?.message || 'Error creating account. Please try again.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                profile_picture: file
            }));
        }
    };

    const renderForm = () => {
        if (!showForm) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            Create {formType === 'staff' ? 'Staff' : 'Customer'} Account
                        </h2>
                        <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {formType === 'staff' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                                        <input
                                            type="text"
                                            name="employee_id"
                                            value={formData.employee_id}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                            minLength="8"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Role</label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="meter_reader">Meter Reader</option>
                                            <option value="bill_handler">Bill Handler</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                        <input
                                            type="text"
                                            name="contact_number"
                                            value={formData.contact_number}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                            minLength="8"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Customer Type</label>
                                        <select
                                            name="customer_type"
                                            value={formData.customer_type}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="residential">Residential</option>
                                            <option value="commercial">Commercial</option>
                                            <option value="government">Government</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Account Number</label>
                                        <input
                                            type="text"
                                            name="account_number"
                                            value={formData.account_number}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Meter Number</label>
                                        <input
                                            type="text"
                                            name="meter_number"
                                            value={formData.meter_number}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                        <input
                                            type="text"
                                            name="contact_number"
                                            value={formData.contact_number}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const tabs = [
        { id: 'all', label: 'All Accounts' },
        { id: 'admin', label: 'Admins' },
        { id: 'meter_reader', label: 'Meter Readers' },
        { id: 'bill_handler', label: 'Bill Handlers' },
        { id: 'customer', label: 'Customers' }
    ];

    const filteredAccounts = accounts.filter(account => {
        if (activeTab === 'all') return true;
        if (activeTab === 'customer') return account.customer;
        if (account.staff) {
            return account.staff.role === activeTab;
        }
        return false;
    });

    return (
        <div className="min-h-screen bg-[#60B5FF] font-[Poppins] overflow-x-hidden">
            {/* Sidebar */}
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
                    <Link href="/admin/accounts" className={`flex items-center px-6 py-3 text-base text-blue-600 bg-blue-50 ${window.location.pathname === '/admin/accounts' ? 'text-blue-600 bg-blue-50' : ''}`}> 
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
                    <Link href="/admin/tickets" className={`flex items-center px-6 py-3 text-base text-gray-600 hover:bg-gray-50 ${window.location.pathname === '/admin/tickets' ? 'text-blue-600 bg-blue-50' : ''}`}> 
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
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                    <h1 className="text-xl font-semibold">Manage Accounts</h1>
                    <Link href="/admin/profile">
                        <img 
                            src={profilePicture || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Admin'}&background=0D8ABC&color=fff`}
                            alt="Profile" 
                            className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity object-cover"
                        />
                    </Link>
                </div>

                {/* Add Account Buttons */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => {
                                setFormType('staff');
                                setShowForm(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                        >
                            <span className="material-symbols-outlined mr-2">person_add</span>
                            Add Staff
                        </button>
                        <button
                            onClick={() => {
                                setFormType('customer');
                                setShowForm(true);
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                        >
                            <span className="material-symbols-outlined mr-2">person_add</span>
                            Add Customer
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-md mb-6">
                    <div className="flex overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Accounts Table */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-3 px-4 font-semibold">ID</th>
                                    <th className="py-3 px-4 font-semibold">Name</th>
                                    <th className="py-3 px-4 font-semibold">Email</th>
                                    <th className="py-3 px-4 font-semibold">Type</th>
                                    <th className="py-3 px-4 font-semibold">Role/Account</th>
                                    <th className="py-3 px-4 font-semibold">Contact</th>
                                    <th className="py-3 px-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAccounts.map((account) => (
                                    <tr key={account.id} className="border-b hover:bg-blue-50">
                                        <td className="py-3 px-4">{account.id}</td>
                                        <td className="py-3 px-4">{account.name}</td>
                                        <td className="py-3 px-4">{account.email}</td>
                                        <td className="py-3 px-4">
                                            {account.staff ? 'Staff' : account.customer ? 'Customer' : 'Unknown'}
                                        </td>
                                        <td className="py-3 px-4">
                                            {account.staff ? account.staff.role : account.customer ? account.customer.customer_type : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4">
                                            {account.staff ? account.staff.contact_number : account.customer ? account.customer.contact_number : 'N/A'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => {/* Add edit functionality */}}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <span className="material-symbols-outlined">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => {/* Add delete functionality */}}
                                                    className="text-red-600 hover:text-red-800 ml-4"
                                                >
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Account Form Modal */}
            {renderForm()}
        </div>
    );
};

export default Accounts; 
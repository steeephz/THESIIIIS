import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import Notification from '@/Components/Notification';
import ConfirmDialog from '@/Components/ConfirmDialog';
import AdminLayout from '@/Layouts/AdminLayout';

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
        name: '',
        username: '',
        password: '',
        role: 'admin',
        address: '',
        contact_number: '',
        email: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [editingAccount, setEditingAccount] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        accountId: null,
        type: 'delete'
    });
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
            console.log('Fetching accounts with type:', activeTab);
            const response = await axios.get(`/api/accounts?type=${activeTab}&search=${searchTerm}`);
            console.log('API Response:', response.data);
            
            if (response.data.success) {
                setAccounts(response.data.data.data);
                console.log('Updated accounts state:', response.data.data.data);
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

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
    };

    const handleEdit = (account) => {
        setEditingAccount(account);
        setFormData({
            name: account.name,
            username: account.username,
            password: '', // Empty for edit
            role: account.role,
            address: account.address,
            contact_number: account.contact_number,
            email: account.email
        });
        setShowForm(true);
    };

    const handleConfirmAction = async () => {
        try {
            const response = await axios.delete(`/api/accounts/staff/${confirmDialog.accountId}`);
            if (response.data.success) {
                showNotification('Account deleted successfully');
                fetchAccounts();
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            showNotification(error.response?.data?.message || 'Error deleting account', 'error');
        }
        setConfirmDialog({ isOpen: false, accountId: null, type: 'delete' });
    };

    const handleCancelAction = () => {
        setConfirmDialog({ isOpen: false, accountId: null, type: 'delete' });
    };

    const handleDelete = async (id) => {
        setConfirmDialog({
            isOpen: true,
            accountId: id,
            type: 'delete'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            
            if (editingAccount) {
                response = await axios.put(`/api/accounts/staff/${editingAccount.id}`, formData);
            } else {
                response = await axios.post('/api/accounts/staff', formData);
            }
            
            if (response.data.success) {
                setShowForm(false);
                setEditingAccount(null);
                setFormData({
                    name: '',
                    username: '',
                    password: '',
                    role: 'admin',
                    address: '',
                    contact_number: '',
                    email: ''
                });
                fetchAccounts();
                showNotification(editingAccount ? 'Account updated successfully!' : 'Account created successfully!');
            }
        } catch (error) {
            console.error('Error saving account:', error);
            showNotification(error.response?.data?.message || 'Error saving account', 'error');
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
                            {editingAccount ? 'Edit Staff Account' : 'Create Staff Account'}
                        </h2>
                        <button 
                            onClick={() => {
                                setShowForm(false);
                                setEditingAccount(null);
                            }} 
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {formType === 'staff' ? (
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
                                            <option value="meter handler">Meter Handler</option>
                                            <option value="bill handler">Bill Handler</option>
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
                                            maxLength={8}
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            onChange={e => {
                                                // Only allow numeric and up to 8 chars
                                                const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                                                setFormData(prev => ({ ...prev, account_number: val }));
                                            }}
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
        if (activeTab === 'customer') return account.type === 'customer';
        if (account.type === 'staff') {
            return account.role === activeTab;
        }
        return false;
    });

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const handleConfirmLogout = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie');
            await axios.post('/admin/logout');
            window.location.href = '/';
        } catch (error) {
            window.location.href = '/';
        }
    };

    const handleCancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    return (
        <AdminLayout>
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
                                        {account.type === 'staff' ? 'Staff' : 'Customer'}
                                    </td>
                                    <td className="py-3 px-4">
                                        {account.type === 'staff' ? account.role : account.customer_type}
                                    </td>
                                    <td className="py-3 px-4">{account.contact_number}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleEdit(account)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(account.id)}
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

            {/* Create Account Form Modal */}
            {renderForm()}

            {/* Add Notification component */}
            {notification.show && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ ...notification, show: false })}
                />
            )}

            {/* Add ConfirmDialog component */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                message="Are you sure you want to delete this account? This action cannot be undone."
                onConfirm={handleConfirmAction}
                onCancel={handleCancelAction}
            />

            {/* Add Logout Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showLogoutConfirm}
                message="Are you sure you want to log out?"
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
            />
        </AdminLayout>
    );
};

export default Accounts; 
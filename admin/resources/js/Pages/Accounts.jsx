import React, { useState, useEffect, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import Notification from '@/Components/Notification';
import ConfirmDialog from '@/Components/ConfirmDialog';
import AdminLayout from '@/Layouts/AdminLayout';
import DynamicTitleLayout from '@/Layouts/DynamicTitleLayout';

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
    const [showPassword, setShowPassword] = useState(false);
    const [tabs] = useState([
        { id: 'all', label: 'All Accounts' },
        { id: 'admin', label: 'Admins' },
        { id: 'meter handler', label: 'Meter Readers' },
        { id: 'bill handler', label: 'Bill Handlers' },
        { id: 'customer', label: 'Customers' }
    ]);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        role: 'admin',
        address: '',
        contact_number: '',
        email: '',
        customer_type: 'residential',
        account_number: '',
        meter_number: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [editingAccount, setEditingAccount] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        accountId: null,
        type: null
    });
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Add validation state
    const [formErrors, setFormErrors] = useState({
        name: '',
        username: '',
        account_number: '',
        meter_number: '',
        address: '',
        email: '',
        contact_number: ''
    });

    // Add validation functions
    const validateName = (name) => {
        return /^[A-Za-z\s]+$/.test(name);
    };

    const validateUsername = (username) => {
        return /^[A-Za-z0-9]+$/.test(username);
    };

    const validateAccountNumber = (accountNumber) => {
        return /^\d{2}-\d{6}$/.test(accountNumber) && accountNumber.length === 9;
    };

    const validateContactNumber = (contactNumber) => {
        return /^\d{11}$/.test(contactNumber);
    };

    const validateMeterNumber = (meterNumber) => {
        return /^\d{9}$/.test(meterNumber);
    };

    const validateAddress = (address) => {
        return /^[A-Za-z0-9\s,.-]+$/.test(address);
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Add password validation function
    const validatePassword = (password) => {
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return hasNumber && hasSpecialChar;
    };

    // Filter accounts based on active tab and search term
    const filteredAccounts = useMemo(() => {
        console.log('Current accounts:', accounts);
        console.log('Active tab:', activeTab);
        
        return accounts.filter(account => {
            console.log('Checking account:', account);
            const matchesSearch = searchTerm === '' || 
                account.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                account.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                account.email?.toLowerCase().includes(searchTerm.toLowerCase());

            if (activeTab === 'all') return matchesSearch; // Show all accounts
            if (activeTab === 'admin') return account.role?.toLowerCase() === 'admin' && matchesSearch;
            if (activeTab === 'meter handler') return account.role?.toLowerCase() === 'meter handler' && matchesSearch;
            if (activeTab === 'bill handler') return account.role?.toLowerCase() === 'bill handler' && matchesSearch;
            if (activeTab === 'customer') return account.type?.toLowerCase() === 'customer' && matchesSearch;
            return false;
        });
    }, [accounts, activeTab, searchTerm]);

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
                // Ensure role names are consistent
                const processedAccounts = response.data.data.data.map(account => ({
                    ...account,
                    role: account.role?.toLowerCase().trim()
                }));
                setAccounts(processedAccounts);
                console.log('Updated accounts state:', processedAccounts);
            }
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let error = '';

        switch (name) {
            case 'name':
                if (!validateName(value)) {
                    error = 'Name should only contain letters';
                }
                break;
            case 'username':
                if (!validateUsername(value)) {
                    error = 'Username should not contain spaces or special characters';
                }
                break;
            case 'password':
                if (!validatePassword(value)) {
                    error = 'Password must contain at least one number and one special character';
                }
                break;
            case 'account_number':
                if (!validateAccountNumber(value)) {
                    error = 'Account number should be in format XX-XXXXXX (9 characters)';
                }
                break;
            case 'contact_number':
                if (!validateContactNumber(value)) {
                    error = 'Contact number should be 11 digits';
                }
                break;
            case 'meter_number':
                if (!validateMeterNumber(value)) {
                    error = 'Meter number should be 9 digits';
                }
                break;
            case 'address':
                if (!validateAddress(value)) {
                    error = 'Address should not contain special characters';
                }
                break;
            case 'email':
                if (!validateEmail(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
        }

        setFormErrors(prev => ({
            ...prev,
            [name]: error
        }));

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
        setFormType(account.type === 'customer' ? 'customer' : 'staff');
        setFormData({
            name: account.name,
            username: account.username,
            password: '', // Empty for edit
            role: account.role || 'admin',
            address: account.address,
            contact_number: account.contact_number,
            email: account.email,
            customer_type: account.customer_type || 'residential',
            account_number: account.account_number || '',
            meter_number: account.meter_number || ''
        });
        setShowForm(true);
    };

    const handleConfirmAction = async () => {
        try {
            let response;
            if (confirmDialog.type === 'staff') {
                response = await axios.delete(`/api/accounts/staff/${confirmDialog.accountId}`);
            } else {
                response = await axios.delete(`/api/accounts/customer/${confirmDialog.accountId}`);
            }
            
            if (response.data.success) {
                showNotification('Account deleted successfully');
                fetchAccounts();
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            showNotification(error.response?.data?.message || 'Error deleting account', 'error');
        }
        setConfirmDialog({ isOpen: false, accountId: null, type: null });
    };

    const handleCancelAction = () => {
        setConfirmDialog({ isOpen: false, accountId: null, type: null });
    };

    const handleDelete = async (id, type) => {
        setConfirmDialog({
            isOpen: true,
            accountId: id,
            type: type
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields before submission
        const errors = {};
        
        // Always validate these fields
        if (!validateName(formData.name)) {
            errors.name = 'Name should only contain letters';
        }
        if (!validateUsername(formData.username)) {
            errors.username = 'Username should not contain spaces or special characters';
        }
        if (!validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        if (!validateAddress(formData.address)) {
            errors.address = 'Address should not contain special characters';
        }
        if (!validateContactNumber(formData.contact_number)) {
            errors.contact_number = 'Contact number should be 11 digits';
        }

        // Only validate customer-specific fields if it's a customer form
        if (formType === 'customer') {
            if (!validateAccountNumber(formData.account_number)) {
                errors.account_number = 'Account number should be in format XX-XXXXXX (9 characters)';
            }
            if (!validateMeterNumber(formData.meter_number)) {
                errors.meter_number = 'Meter number should be 9 digits';
            }
        }

        // Only validate password for new accounts
        if (!editingAccount && !validatePassword(formData.password)) {
            errors.password = 'Password must contain at least one number and one special character';
        }

        setFormErrors(errors);

        // Check if there are any errors
        if (Object.keys(errors).length > 0) {
            showNotification('Please fix the form errors before submitting', 'error');
            return;
        }

        try {
            let response;
            
            if (formType === 'staff') {
                if (editingAccount) {
                    response = await axios.put(`/api/accounts/staff/${editingAccount.id}`, formData);
                } else {
                    response = await axios.post('/api/accounts/staff', formData);
                }
            } else {
                // Handle customer creation/update
                const customerData = {
                    name: formData.name,
                    username: formData.username,
                    customer_type: formData.customer_type,
                    address: formData.address,
                    contact_number: formData.contact_number,
                    email: formData.email,
                    account_number: formData.account_number,
                    meter_number: formData.meter_number
                };

                // Only include password for new accounts
                if (!editingAccount) {
                    customerData.password = formData.password;
                }
                
                if (editingAccount) {
                    response = await axios.put(`/api/accounts/customer/${editingAccount.id}`, customerData);
                } else {
                    response = await axios.post('/api/accounts/customer', customerData);
                }
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
                    email: '',
                    customer_type: 'residential',
                    account_number: '',
                    meter_number: ''
                });
                setFormErrors({});
                fetchAccounts();
                showNotification(formType === 'staff' 
                    ? (editingAccount ? 'Staff account updated successfully!' : 'Staff account created successfully!')
                    : (editingAccount ? 'Customer account updated successfully!' : 'Customer account created successfully!'));
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

    const clearFormData = () => {
        setFormData({
            name: '',
            username: '',
            password: '',
            role: 'admin',
            address: '',
            contact_number: '',
            email: '',
            customer_type: 'residential',
            account_number: '',
            meter_number: ''
        });
        setEditingAccount(null);
    };

    const handleFormClose = () => {
        setShowForm(false);
        clearFormData();
    };

    const handleFormTypeChange = (type) => {
        setFormType(type);
        clearFormData();
        setShowForm(true);
    };

    const renderForm = () => {
        if (!showForm) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            {formType === 'staff' 
                                ? (editingAccount ? 'Edit Staff Account' : 'Create Staff Account')
                                : (editingAccount ? 'Edit Customer Account' : 'Create Customer Account')
                            }
                        </h2>
                        <button 
                            onClick={handleFormClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {formType === 'staff' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Role
                                        </label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="meter handler">Meter Reader</option>
                                            <option value="bill handler">Bill Handler</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                                formErrors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {formErrors.name && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Customer Type
                                        </label>
                                        <select
                                            name="customer_type"
                                            value={formData.customer_type}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="residential">Residential</option>
                                            <option value="commercial">Commercial</option>
                                            <option value="government">Government</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Account Number
                                        </label>
                                        <input
                                            type="text"
                                            name="account_number"
                                            value={formData.account_number}
                                            onChange={handleInputChange}
                                            maxLength="9"
                                            placeholder="XX-XXXXXX"
                                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                                formErrors.account_number ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {formErrors.account_number && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.account_number}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Meter Number
                                        </label>
                                        <input
                                            type="text"
                                            name="meter_number"
                                            value={formData.meter_number}
                                            onChange={handleInputChange}
                                            maxLength="9"
                                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                                formErrors.meter_number ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {formErrors.meter_number && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.meter_number}</p>
                                        )}
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                        formErrors.username ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {formErrors.username && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                                )}
                            </div>
                            {!editingAccount && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                                formErrors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            <span className="material-symbols-outlined">
                                                {showPassword ? "visibility_off" : "visibility"}
                                            </span>
                                        </button>
                                    </div>
                                    {formErrors.password && (
                                        <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                                    )}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    name="contact_number"
                                    value={formData.contact_number}
                                    onChange={handleInputChange}
                                    maxLength="11"
                                    placeholder="Enter 11 digits"
                                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                        formErrors.contact_number ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {formErrors.contact_number && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.contact_number}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {formErrors.email && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                        formErrors.address ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {formErrors.address && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={handleFormClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                {formType === 'staff' ? (editingAccount ? 'Update Account' : 'Create Account') : (editingAccount ? 'Update Customer' : 'Create Customer')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

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
        <DynamicTitleLayout userRole="admin">
            <AdminLayout>
                {/* Add Account Buttons */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleFormTypeChange('staff')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                        >
                            <span className="material-symbols-outlined mr-2">person_add</span>
                            Add Staff
                        </button>
                        <button
                            onClick={() => handleFormTypeChange('customer')}
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

                {/* Search Input */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search accounts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            search
                        </span>
                    </div>
                </div>

                {/* Accounts Table */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead>
                                <tr>
                                    {activeTab === 'customer' ? (
                                        <>
                                            <th className="py-3 px-4 font-semibold">Name</th>
                                            <th className="py-3 px-4 font-semibold">Username</th>
                                            <th className="py-3 px-4 font-semibold">Customer Type</th>
                                            <th className="py-3 px-4 font-semibold">Address</th>
                                            <th className="py-3 px-4 font-semibold">Contact Number</th>
                                            <th className="py-3 px-4 font-semibold">Email</th>
                                            <th className="py-3 px-4 font-semibold">Account Number</th>
                                            <th className="py-3 px-4 font-semibold">Meter Number</th>
                                            <th className="py-3 px-4 font-semibold">Actions</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="py-3 px-4 font-semibold">Name</th>
                                            <th className="py-3 px-4 font-semibold">Username</th>
                                            <th className="py-3 px-4 font-semibold">Role</th>
                                            <th className="py-3 px-4 font-semibold">Address</th>
                                            <th className="py-3 px-4 font-semibold">Contact Number</th>
                                            <th className="py-3 px-4 font-semibold">Email</th>
                                            <th className="py-3 px-4 font-semibold">Actions</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAccounts.map((account) => (
                                    <tr key={account.id} className="border-b hover:bg-blue-50">
                                        {activeTab === 'customer' ? (
                                            <>
                                                <td className="py-3 px-4">{account.name}</td>
                                                <td className="py-3 px-4">{account.username}</td>
                                                <td className="py-3 px-4">{account.customer_type}</td>
                                                <td className="py-3 px-4">{account.address}</td>
                                                <td className="py-3 px-4">{account.contact_number}</td>
                                                <td className="py-3 px-4">{account.email}</td>
                                                <td className="py-3 px-4">{account.account_number}</td>
                                                <td className="py-3 px-4">{account.meter_number}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center">
                                                        <button
                                                            onClick={() => handleEdit(account)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <span className="material-symbols-outlined">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(account.id, 'customer')}
                                                            className="text-red-600 hover:text-red-800 ml-4"
                                                        >
                                                            <span className="material-symbols-outlined">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="py-3 px-4">{account.name}</td>
                                                <td className="py-3 px-4">{account.username}</td>
                                                <td className="py-3 px-4">{account.role}</td>
                                                <td className="py-3 px-4">{account.address}</td>
                                                <td className="py-3 px-4">{account.contact_number}</td>
                                                <td className="py-3 px-4">{account.email}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center">
                                                        <button
                                                            onClick={() => handleEdit(account)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <span className="material-symbols-outlined">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(account.id, 'staff')}
                                                            className="text-red-600 hover:text-red-800 ml-4"
                                                        >
                                                            <span className="material-symbols-outlined">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
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
        </DynamicTitleLayout>
    );
};

export default Accounts; 
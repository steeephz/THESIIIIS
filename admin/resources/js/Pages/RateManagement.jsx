import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';

const RateManagement = () => {
    const [accountType, setAccountType] = useState('All');
    return (
        <div className="min-h-screen bg-[#60B5FF] font-[Poppins] overflow-x-hidden">
            <div className="fixed left-0 top-0 h-full w-[240px] bg-white shadow-lg">
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
            <div className="lg:ml-[240px] p-3 sm:p-4 md:p-6 lg:p-6 pt-16 lg:pt-6">
                <h1 className="text-xl font-semibold mb-6">Rate Management</h1>
                <div className="flex items-center mb-6">
                    <label htmlFor="accountType" className="mr-2 font-medium">Filter by Account Type:</label>
                    <select
                        id="accountType"
                        value={accountType}
                        onChange={e => setAccountType(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]"
                    >
                        <option value="All">All</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Residential">Residential</option>
                        <option value="Government">Government</option>
                    </select>
                </div>
                <div className="text-gray-600 text-center py-8">PANG SAMGY..... (Filter: {accountType})</div>
            </div>
        </div>
    );
};

export default RateManagement; 
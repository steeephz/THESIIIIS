import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';

const Reports = () => {
    const { auth } = usePage().props;
    const [profilePicture, setProfilePicture] = useState(null);
    const [activeTab, setActiveTab] = useState('paymentReport'); // Only 'paymentReport' or 'meter'
    const [accountType, setAccountType] = useState('All'); // Add this after other useState

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
    }, []);

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
                    <h1 className="text-xl font-semibold">Reports</h1>
                    <div className="flex items-center w-full sm:w-auto gap-2">
                        <div className="relative flex-1 sm:flex-none mr-3">
                            <span className="material-symbols-outlined absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">search</span>
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full sm:w-auto pl-8 pr-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <Link href="/admin/profile">
                            <img 
                                src={profilePicture || `https://ui-avatars.com/api/?name=${auth?.user?.name || 'Admin'}&background=0D8ABC&color=fff`}
                                alt="Profile" 
                                className="w-8 h-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity object-cover"
                            />
                        </Link>
                    </div>
                </div>

                {/* Report Tabs */}
                <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-6xl mx-auto">
                    {/* Filter Dropdown */}
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
                    <div className="flex border-b mb-6">
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === 'paymentReport' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('paymentReport')}
                        >
                            Payment Report
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === 'meter' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('meter')}
                        >
                            Meter Reading Report
                        </button>
                    </div>

                    {/* Export Buttons */}
                    <div className="flex justify-end gap-2 mb-4">
                        <button className="flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                            <span className="material-symbols-outlined mr-1 text-sm">download</span>
                            Export to Excel
                        </button>
                        <button className="flex items-center px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
                            <span className="material-symbols-outlined mr-1 text-sm">picture_as_pdf</span>
                            Export to PDF
                        </button>
                    </div>

                    {/* Payment Report Table */}
                    {activeTab === 'paymentReport' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 px-4 font-semibold">Payment Date</th>
                                        <th className="py-2 px-4 font-semibold">Customer Name</th>
                                        <th className="py-2 px-4 font-semibold">Account Number</th>
                                        <th className="py-2 px-4 font-semibold">Payment Amount</th>
                                        <th className="py-2 px-4 font-semibold">Payment Method</th>
                                        <th className="py-2 px-4 font-semibold">Status</th>
                                        <th className="py-2 px-4 font-semibold">Reference Number</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Sample data - replace with actual data */}
                                    <tr className="border-b hover:bg-blue-50">
                                        <td className="py-2 px-4">2024-03-20</td>
                                        <td className="py-2 px-4">John Doe</td>
                                        <td className="py-2 px-4">12345678</td>
                                        <td className="py-2 px-4">₱1,500.00</td>
                                        <td className="py-2 px-4">Online</td>
                                        <td className="py-2 px-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Successful</span>
                                        </td>
                                        <td className="py-2 px-4">PM123456789</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Meter Reading Report Table */}
                    {activeTab === 'meter' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2 px-4 font-semibold">Meter Reader</th>
                                        <th className="py-2 px-4 font-semibold">Reading Date</th>
                                        <th className="py-2 px-4 font-semibold">Account Number</th>
                                        <th className="py-2 px-4 font-semibold">Previous Reading</th>
                                        <th className="py-2 px-4 font-semibold">Current Reading</th>
                                        <th className="py-2 px-4 font-semibold">Consumption (cu.m.)</th>
                                        <th className="py-2 px-4 font-semibold">Remarks</th>
                                        <th className="py-2 px-4 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Sample data - replace with actual data */}
                                    <tr className="border-b hover:bg-blue-50">
                                        <td className="py-2 px-4">Jane Smith</td>
                                        <td className="py-2 px-4">2024-03-20</td>
                                        <td className="py-2 px-4">12345678</td>
                                        <td className="py-2 px-4">100</td>
                                        <td className="py-2 px-4">150</td>
                                        <td className="py-2 px-4">50</td>
                                        <td className="py-2 px-4">Normal reading</td>
                                        <td className="py-2 px-4">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Normal</span>
                                        </td>
                                    </tr>
                                    <tr className="border-b hover:bg-blue-50">
                                        <td className="py-2 px-4">Mike Johnson</td>
                                        <td className="py-2 px-4">2024-03-20</td>
                                        <td className="py-2 px-4">87654321</td>
                                        <td className="py-2 px-4">200</td>
                                        <td className="py-2 px-4">500</td>
                                        <td className="py-2 px-4">300</td>
                                        <td className="py-2 px-4">Suspected leak</td>
                                        <td className="py-2 px-4">
                                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Abnormal</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports; 
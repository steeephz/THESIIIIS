import React from 'react';
import Footer from '../components/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4">
          <img src="/logo.png" alt="Hermosa Water District" className="w-full mb-6" />
        </div>
        <nav className="px-4">
          <ul className="space-y-2">
            <li>
              <a href="/dashboard" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50 text-blue-600">
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/announcement" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50">
                <span>Announcement</span>
              </a>
            </li>
            <li>
              <a href="/manage-accounts" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50">
                <span>Manage Accounts</span>
              </a>
            </li>
            <li>
              <a href="/rate-management" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50">
                <span>Rate Management</span>
              </a>
            </li>
            <li>
              <a href="/payment" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50">
                <span>Payment</span>
              </a>
            </li>
            <li>
              <a href="/reports" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50">
                <span>Reports</span>
              </a>
            </li>
            <li>
              <a href="/tickets" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50">
                <span>Tickets</span>
              </a>
            </li>
            <li>
              <a href="/profile" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50">
                <span>Profile</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
        <header className="bg-white border-b p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-800">
                <span>SU</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
} 
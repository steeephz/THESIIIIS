import React from 'react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-2">Users</h3>
          <p className="text-2xl font-semibold">15</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-2">Total Payments</h3>
          <p className="text-2xl font-semibold">₱25,000</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-600 mb-2">Active Users</h3>
          <p className="text-2xl font-semibold">8</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">This Month</h3>
          <p className="text-xl font-semibold mb-4">₱25,000.00</p>
          {/* Add your chart component here */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">Payment Analysis</h3>
          {/* Add your chart component here */}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold">Recent Payments</h3>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search recent payments"
              className="px-4 py-2 border rounded-lg"
            />
            <a href="#" className="text-blue-600 text-sm">See all</a>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">LP</div>
              <span>Liam Payne</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold">₱344.00</span>
              <span className="text-gray-500 text-sm">30s ago</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">CS</div>
              <span>Carlos Sainz</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold">₱243.00</span>
              <span className="text-gray-500 text-sm">20m ago</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">ZM</div>
              <span>Zayn Malik</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold">₱268.00</span>
              <span className="text-gray-500 text-sm">1h ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
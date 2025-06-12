import React, { useState } from 'react';
import BillHandlerLayout from '@/Layouts/BillHandlerLayout';
import DynamicTitleLayout from '@/Layouts/DynamicTitleLayout';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const metricCards = [
  {
    title: 'Users',
    value: 15,
    icon: (
      <span className="material-symbols-outlined text-3xl text-blue-500 bg-blue-100 p-3 rounded-full">group</span>
    ),
  },
  {
    title: 'Total Payments',
    value: '₱25,000',
    icon: (
      <span className="material-symbols-outlined text-3xl text-green-500 bg-green-100 p-3 rounded-full">payments</span>
    ),
  },
  {
    title: 'Active Users',
    value: 8,
    icon: (
      <span className="material-symbols-outlined text-3xl text-purple-500 bg-purple-100 p-3 rounded-full">person</span>
    ),
  },
];

const lineData = {
  labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
  datasets: [
    {
      label: 'Payments',
      data: [4000, 4500, 3000, 6000, 4800, 5200],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 3,
      pointBackgroundColor: '#3B82F6',
    },
  ],
};

const barData = {
  labels: ['Payments Done', 'Payments Pending'],
  datasets: [
    {
      label: 'Payments',
      data: [65, 35],
      backgroundColor: ['#3B82F6', '#93C5FD'],
      borderRadius: 6,
      barPercentage: 0.5,
    },
  ],
};

const recentPayments = [
  { initials: 'LP', name: 'Liam Payne', amount: 344, time: '30s ago' },
  { initials: 'CS', name: 'Carlos Sainz', amount: 243, time: '20m ago' },
  { initials: 'ZM', name: 'Zayn Malik', amount: 268, time: '1h ago' },
];

const BillHandlerDashboard = () => {
  const [search, setSearch] = useState('');
  const filteredPayments = recentPayments.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DynamicTitleLayout userRole="bill handler">
      <BillHandlerLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {metricCards.map((card, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-gray-500 text-sm">{card.title}</div>
                  <div className="text-2xl font-bold">{card.value}</div>
                </div>
                {card.icon}
              </div>
            ))}
          </div>
          {/* Charts and Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg shadow p-4 flex flex-col">
              <div className="font-semibold mb-2">This Month</div>
              <div className="flex-1 min-h-[180px]">
                <Line data={lineData} options={{
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, ticks: { stepSize: 1000 } } },
                  maintainAspectRatio: false,
                }} height={180} />
              </div>
              <div className="text-2xl font-bold mt-2">₱25,000.00</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col">
              <div className="font-semibold mb-2">Payment Analysis</div>
              <div className="flex-1 min-h-[180px]">
                <Bar data={barData} options={{
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, max: 100 } },
                  maintainAspectRatio: false,
                }} height={180} />
              </div>
              <div className="flex gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span> Payments Done (65%)
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-200"></span> Payments Pending (35%)
                </div>
              </div>
            </div>
          </div>
          {/* Recent Payments */}
          <div className="bg-white rounded-lg shadow p-4 mt-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
              <div className="font-semibold">Recent Payments</div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search recent payments"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="text-blue-500 font-medium hover:underline">see all</button>
              </div>
            </div>
            <div>
              {filteredPayments.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-lg font-bold text-blue-700">
                      {p.initials}
                    </div>
                    <div className="font-medium">{p.name}</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="font-bold text-lg">₱{p.amount.toFixed(2)}</div>
                    <div className="text-gray-400 text-sm">{p.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BillHandlerLayout>
    </DynamicTitleLayout>
  );
};

export default BillHandlerDashboard; 
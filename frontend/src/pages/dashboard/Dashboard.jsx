import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  ComputerDesktopIcon, 
  ClockIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
  { name: 'Total Users', icon: UserGroupIcon, key: 'users', color: 'bg-sky-500' },
  { name: 'Active Devices', icon: ComputerDesktopIcon, key: 'devices', color: 'bg-green-500' },
  { name: "Today's Attendance", icon: ClockIcon, key: 'attendanceToday', color: 'bg-purple-500' },
];

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, trendRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/attendance-trend')
      ]);
      setDashboardData(dashboardRes.data);
      setTrendData(trendRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.key} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {dashboardData?.totals?.[stat.key] || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Attendance Trend (Last 7 days)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#0284c7" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Attendance</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {dashboardData?.recentAttendance?.map((record) => (
            <li key={record.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={record.image ? `http://localhost:5000/uploads/${record.image}` : '/default-avatar.png'}
                    alt=""
                  />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {record.first_name} {record.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{record.role}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {record.method}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(record.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
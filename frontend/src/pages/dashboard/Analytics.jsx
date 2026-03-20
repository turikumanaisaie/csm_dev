import { useState, useEffect } from 'react';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0284c7', '#f97316', '#10b981', '#ef4444'];

export default function Analytics() {
  const [dashboardData, setDashboardData] = useState(null);
  const [popularTimes, setPopularTimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [dashboardRes, popularRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/popular-times')
      ]);
      setDashboardData(dashboardRes.data);
      setPopularTimes(popularRes.data);
    } catch (error) {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading analytics...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Users by Role */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Users by Role</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData?.usersByRole || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={entry => entry.role}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {dashboardData?.usersByRole?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Device Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData?.deviceStatus || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={entry => entry.status}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {dashboardData?.deviceStatus?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Times */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Attendance by Hour of Day</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularTimes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#0284c7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    userId: '',
    deviceId: '',
  });
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetchAttendance();
    fetchUsers();
    fetchDevices();
  }, []);

  const fetchAttendance = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.deviceId) params.append('deviceId', filters.deviceId);

      const res = await api.get(`/attendance?${params.toString()}`);
      setAttendance(res.data);
    } catch (error) {
      toast.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users');
    }
  };

  const fetchDevices = async () => {
    try {
      const res = await api.get('/devices');
      setDevices(res.data);
    } catch (error) {
      console.error('Failed to fetch devices');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchAttendance();
  };

  const resetFilters = () => {
    setFilters({ startDate: '', endDate: '', userId: '', deviceId: '' });
    setTimeout(fetchAttendance, 0);
  };

  if (loading) {
    return <div className="text-center py-12">Loading attendance...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Attendance Records</h1>

      {/* Filters */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
            User
          </label>
          <select
            name="userId"
            id="userId"
            value={filters.userId}
            onChange={handleFilterChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700">
            Device
          </label>
          <select
            name="deviceId"
            id="deviceId"
            value={filters.deviceId}
            onChange={handleFilterChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
          >
            <option value="">All Devices</option>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.device_name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-4 flex justify-end space-x-2">
          <button
            onClick={applyFilters}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="mt-6 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendance.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.first_name} {record.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{record.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.device_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(record.timestamp), 'PPpp')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {record.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'check_in' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
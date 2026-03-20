import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import DeviceFormModal from '../../components/DeviceFormModal'; // separate component

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await api.get('/devices');
      setDevices(res.data);
    } catch (error) {
      toast.error('Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this device?')) return;
    try {
      await api.delete(`/devices/${id}`);
      toast.success('Device deleted');
      fetchDevices();
    } catch (error) {
      toast.error('Failed to delete device');
    }
  };

  const handleEdit = (device) => {
    setEditingDevice(device);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingDevice(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    fetchDevices();
  };

  if (loading) {
    return <div className="text-center py-12">Loading devices...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Devices</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Device
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {devices.map((device) => (
          <div key={device.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{device.device_name}</h3>
                  <p className="text-sm text-gray-500">Type: {device.device_type}</p>
                  <p className="text-sm text-gray-500">ID: {device.unique_device_id}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(device)}
                    className="text-sky-600 hover:text-sky-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(device.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  device.status === 'active' ? 'bg-green-100 text-green-800' :
                  device.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {device.status}
                </span>
                {device.last_seen && (
                  <span className="ml-2 text-xs text-gray-500">
                    Last seen: {new Date(device.last_seen).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <DeviceFormModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          device={editingDevice}
        />
      )}
    </div>
  );
}
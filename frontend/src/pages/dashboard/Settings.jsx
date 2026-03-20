import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { CameraIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const { admin } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (admin) {
      reset({
        first_name: admin.first_name,
        last_name: admin.last_name,
        username: admin.username,
        email: admin.email,
      });
    }
  }, [admin, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('username', data.username);
    formData.append('email', data.email);
    if (profileImage) {
      formData.append('profile', profileImage);
    }

    try {
      await api.put('/admin/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={preview || (admin?.profile ? `http://localhost:5000/uploads/${admin.profile}` : '/default-avatar.png')}
                    alt="Profile"
                  />
                </div>
                <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                  <CameraIcon className="h-5 w-5 inline mr-1" />
                  Change Photo
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>

              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  {...register('first_name', { required: 'First name is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                />
                {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>}
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register('last_name', { required: 'Last name is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                />
                {errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>}
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  {...register('username', { required: 'Username is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                />
                {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
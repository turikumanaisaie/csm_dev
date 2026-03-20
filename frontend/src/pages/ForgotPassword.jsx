import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setEmailSent(true);
      toast.success('Reset code sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email and we'll send you a code to reset it.
          </p>
        </div>
        {!emailSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
                id="email"
                type="email"
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send reset code'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              We've sent a code to your email. Please check your inbox.
            </p>
            <div className="mt-4">
              <Link to="/reset-password" className="text-sky-600 hover:text-sky-500">
                Go to reset password
              </Link>
            </div>
          </div>
        )}
        <div className="text-center">
          <Link to="/login" className="font-medium text-sky-600 hover:text-sky-500">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
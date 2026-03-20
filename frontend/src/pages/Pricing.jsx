import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { CheckIcon } from '@heroicons/react/24/outline';

const plans = [
  {
    id: 'free_trial',
    name: 'Free Trial',
    price: 0,
    duration: '30 days',
    features: ['Up to 50 users', 'Basic analytics', 'Email support'],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    duration: 'monthly',
    features: ['Up to 200 users', 'Advanced analytics', 'Priority support'],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 99,
    duration: 'monthly',
    features: ['Unlimited users', 'Premium analytics', '24/7 support', 'API access'],
  },
];

export default function Pricing() {
  const { admin } = useAuth();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin) {
      fetchCurrentPlan();
    }
  }, [admin]);

  const fetchCurrentPlan = async () => {
    try {
      const res = await api.get('/pricing/current');
      setCurrentPlan(res.data.plan);
    } catch (error) {
      console.error('Failed to fetch current plan');
    }
  };

  const selectPlan = async (planId) => {
    if (!admin) {
      toast.error('Please login first');
      return;
    }
    setLoading(true);
    try {
      await api.post('/organization/subscription', { plan: planId });
      toast.success(`Subscribed to ${planId} plan`);
      setCurrentPlan(planId);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose the right plan for your organization
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Start with a free trial, no credit card required.
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                <p className="mt-4 text-sm text-gray-500">{plan.features.length} key features</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-base font-medium text-gray-500">/{plan.duration}</span>
                </p>
                {admin && currentPlan === plan.id ? (
                  <button
                    disabled
                    className="mt-8 w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => selectPlan(plan.id)}
                    disabled={loading}
                    className="mt-8 w-full bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Select Plan'}
                  </button>
                )}
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h4>
                <ul className="mt-4 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 shrink-0" />
                      <span className="ml-3 text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
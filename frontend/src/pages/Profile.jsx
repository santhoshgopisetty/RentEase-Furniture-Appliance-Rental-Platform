import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiUser, FiPhone, FiMapPin, FiMail, FiCheck, FiArrowLeft } from 'react-icons/fi';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || ''
    }
  });

  const onSubmit = async (data) => {
    setSuccessMsg('');
    setSubmitting(true);
    const result = await updateUserProfile(data);
    setSubmitting(false);

    if (result.success) {
      setSuccessMsg('Profile contact information updated successfully!');
      setTimeout(() => setSuccessMsg(''), 2500);
    }
  };

  return (
    <div className="bg-dark-900 text-white min-h-screen py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-dark-400 hover:text-white mb-8 transition-colors">
          <FiArrowLeft className="h-4 w-4" />
          <span>Back to dashboard</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">Account Profile Settings</h1>

        <div className="p-6 rounded-3xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-6">
          <div className="flex items-center gap-3">
            <FiUser className="text-brand-500 h-5 w-5" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Contact Details & Preferences</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {successMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-900/30 p-4 text-xs text-emerald-400 font-semibold animate-pulse">
                <FiCheck className="shrink-0 h-4 w-4" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-dark-400">Full Name</label>
                <div className="relative rounded-xl border border-dark-800 bg-dark-950 px-3 py-2.5 focus-within:border-brand-500 transition-colors flex items-center gap-3">
                  <FiUser className="text-dark-500 h-4 w-4" />
                  <input
                    type="text"
                    className="bg-transparent border-0 p-0 text-xs w-full text-white placeholder-dark-550 focus:outline-none focus:ring-0"
                    {...register('name', { required: 'Name is required' })}
                  />
                </div>
                {errors.name && (
                  <p className="text-[10px] text-rose-400 font-semibold">{errors.name.message}</p>
                )}
              </div>

              {/* Email (readonly) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-dark-500">Email Address (Primary)</label>
                <div className="relative rounded-xl border border-dark-800 bg-dark-900/40 px-3 py-2.5 flex items-center gap-3 text-dark-500 cursor-not-allowed">
                  <FiMail className="h-4 w-4" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-transparent border-0 p-0 text-xs w-full text-dark-500 focus:outline-none focus:ring-0"
                  />
                </div>
                <p className="text-[9px] text-dark-550 leading-normal">* Primary authentication email cannot be changed.</p>
              </div>

              {/* Contact Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-dark-400">Phone Number</label>
                <div className="relative rounded-xl border border-dark-800 bg-dark-950 px-3 py-2.5 focus-within:border-brand-500 transition-colors flex items-center gap-3">
                  <FiPhone className="text-dark-500 h-4 w-4" />
                  <input
                    type="tel"
                    className="bg-transparent border-0 p-0 text-xs w-full text-white placeholder-dark-550 focus:outline-none focus:ring-0"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9+\s-]{10,15}$/,
                        message: 'Enter a valid phone number (10-15 digits)'
                      }
                    })}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[10px] text-rose-400 font-semibold">{errors.phone.message}</p>
                )}
              </div>

              {/* Delivery Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-dark-400">Default Shipping Address</label>
                <div className="relative rounded-xl border border-dark-800 bg-dark-950 px-3 py-2.5 focus-within:border-brand-500 transition-colors flex items-center gap-3">
                  <FiMapPin className="text-dark-500 h-4 w-4" />
                  <input
                    type="text"
                    className="bg-transparent border-0 p-0 text-xs w-full text-white placeholder-dark-550 focus:outline-none focus:ring-0"
                    {...register('address', { required: 'Address is required' })}
                  />
                </div>
                {errors.address && (
                  <p className="text-[10px] text-rose-400 font-semibold">{errors.address.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-brand-600 hover:bg-brand-500 py-3 px-6 text-xs font-bold text-white shadow-neon transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {submitting ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

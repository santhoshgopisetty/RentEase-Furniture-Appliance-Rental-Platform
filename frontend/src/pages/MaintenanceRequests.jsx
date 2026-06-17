import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import API from '../services/api';
import { FiTool, FiArrowLeft, FiAlertCircle, FiCheck, FiActivity } from 'react-icons/fi';

const MaintenanceRequests = () => {
  const [searchParams] = useSearchParams();
  const preselectedOrderId = searchParams.get('orderId') || '';

  const [activeRentals, setActiveRentals] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      rentalOrderId: preselectedOrderId,
      issueDescription: ''
    }
  });

  const fetchData = async () => {
    try {
      const [rentalsRes, ticketsRes] = await Promise.all([
        API.get('/rentals'),
        API.get('/maintenance')
      ]);
      // Only active orders are eligible for maintenance
      setActiveRentals(rentalsRes.data.filter(r => r.status === 'Active'));
      setTickets(ticketsRes.data);
    } catch (err) {
      console.error(err);
      setApiError('Failed to load maintenance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync pre-selected order id if query params change
  useEffect(() => {
    if (preselectedOrderId) {
      setValue('rentalOrderId', preselectedOrderId);
    }
  }, [preselectedOrderId, setValue]);

  const onSubmit = async (data) => {
    setApiError('');
    setSuccessMsg('');
    setSubmitting(true);
    try {
      await API.post('/maintenance', {
        rentalOrderId: data.rentalOrderId,
        issueDescription: data.issueDescription
      });
      setSuccessMsg('Maintenance ticket created successfully. Our technician will contact you.');
      reset({ rentalOrderId: '', issueDescription: '' });
      // Reload tickets
      fetchData();
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.message || 'Failed to submit maintenance claim.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-900 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-dark-900 text-white min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-dark-400 hover:text-white mb-8 transition-colors">
          <FiArrowLeft className="h-4 w-4" />
          <span>Back to dashboard</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">Maintenance & Support Center</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Request Form */}
          <div className="lg:col-span-1 p-6 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-4">
            <div className="flex items-center gap-3">
              <FiTool className="text-brand-500 h-5 w-5" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">File a Support Ticket</h2>
            </div>
            <p className="text-xs text-dark-450 leading-normal">
              Experiencing issues with your furniture or appliance? File a ticket below. Services are fully covered.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
              {successMsg && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-900/30 p-4 text-xs text-emerald-400 font-semibold">
                  <FiCheck className="shrink-0 h-4 w-4" />
                  <span>{successMsg}</span>
                </div>
              )}

              {apiError && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-950/30 border border-rose-900/30 p-4 text-xs text-rose-400 font-semibold">
                  <FiAlertCircle className="shrink-0 h-4 w-4" />
                  <span>{apiError}</span>
                </div>
              )}

              {/* Select active product */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-dark-400">Select Active Item</label>
                <select
                  className="w-full rounded-xl border border-dark-800 bg-dark-950 px-3 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-0"
                  {...register('rentalOrderId', { required: 'Please select an item' })}
                >
                  <option value="">-- Choose item --</option>
                  {activeRentals.map((rental) => (
                    <option key={rental._id} value={rental._id}>
                      {rental.product?.name} (ID: #{rental._id?.slice(-6)})
                    </option>
                  ))}
                </select>
                {errors.rentalOrderId && (
                  <p className="text-[10px] text-rose-400 font-semibold">{errors.rentalOrderId.message}</p>
                )}
              </div>

              {/* Issue description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-dark-400">Describe the Issue</label>
                <textarea
                  placeholder="Describe details of the issue (e.g. washing machine drain leakage, TV screen blank, chair wobbling)..."
                  rows="4"
                  className="w-full rounded-xl border border-dark-800 bg-dark-950 px-3 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-0 placeholder-dark-550"
                  {...register('issueDescription', {
                    required: 'Please describe the issue',
                    minLength: {
                      value: 15,
                      message: 'Description must be at least 15 characters'
                    }
                  })}
                />
                {errors.issueDescription && (
                  <p className="text-[10px] text-rose-400 font-semibold">{errors.issueDescription.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || activeRentals.length === 0}
                className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 py-3 text-xs font-bold text-white shadow-neon transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {submitting ? 'Submitting Ticket...' : 'File Support Ticket'}
              </button>
            </form>
          </div>

          {/* Right: Existing claims */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FiActivity className="text-brand-500 h-4 w-4" />
              <span>Your Ticket History</span>
            </h2>

            {tickets.length === 0 ? (
              <div className="border border-dark-800 bg-dark-950/20 rounded-2xl p-8 text-center text-xs text-dark-450">
                You have not filed any maintenance claims yet.
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket._id} className="p-5 rounded-2xl border border-dark-800 bg-dark-950/30 space-y-4">
                    {/* Header: ticket status and order title */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-dark-500 uppercase">Ticket ID: #{ticket._id?.slice(-8)}</span>
                        <h3 className="text-xs font-bold text-white truncate mt-0.5">
                          {ticket.rentalOrder?.product?.name || 'Unknown Product'}
                        </h3>
                        <p className="text-[9px] text-dark-500">Order ID: #{ticket.rentalOrder?._id?.slice(-8)}</p>
                      </div>

                      <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        ticket.status === 'Open'
                          ? 'bg-rose-950/40 text-rose-400 border border-rose-900/30'
                          : ticket.status === 'In Progress'
                          ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                          : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-4 rounded-xl border border-dark-850 bg-dark-950/40 text-xs italic leading-relaxed text-dark-350 font-light">
                      "{ticket.issueDescription}"
                    </div>

                    {/* Timeline representation */}
                    <div className="flex items-center gap-6 text-[10px] text-dark-500 font-semibold">
                      <span>Submitted: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${
                          ticket.status === 'Open' ? 'bg-rose-500 animate-ping' : ticket.status === 'In Progress' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        Progress: {ticket.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceRequests;

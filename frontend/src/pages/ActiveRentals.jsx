import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { FiCalendar, FiTrendingUp, FiTool, FiArrowLeft, FiX, FiCheck } from 'react-icons/fi';

const ActiveRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extension Modal States
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [extensionMonths, setExtensionMonths] = useState(3);
  const [extending, setExtending] = useState(false);
  const [modalSuccess, setModalSuccess] = useState('');

  const fetchRentals = async () => {
    try {
      const { data } = await API.get('/rentals');
      // Filter for Active
      setRentals(data.filter(r => r.status === 'Active'));
    } catch (err) {
      setError('Failed to fetch active rentals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const openExtension = (rental) => {
    setSelectedRental(rental);
    setExtensionMonths(3);
    setModalSuccess('');
    setShowExtensionModal(true);
  };

  const handleExtendSubmit = async () => {
    if (!selectedRental) return;

    setExtending(true);
    setModalSuccess('');
    try {
      await API.put('/rentals/extend', {
        orderId: selectedRental._id,
        extensionMonths
      });
      setModalSuccess(`Extended rental by ${extensionMonths} months successfully!`);
      setTimeout(() => {
        setShowExtensionModal(false);
        fetchRentals();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Extension failed. Please try again.');
    } finally {
      setExtending(false);
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

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">Active Rental Subscriptions</h1>

        {error && (
          <p className="text-rose-500 text-xs font-semibold mb-6">{error}</p>
        )}

        {rentals.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-dark-800 bg-dark-950/20 p-8">
            <p className="text-dark-400 font-semibold mb-2">No active rental subscriptions.</p>
            <p className="text-xs text-dark-500 mb-6">Subscriptions activate once your pending delivery is completed.</p>
            <Link to="/dashboard" className="bg-dark-800 hover:bg-dark-700 text-white py-2 px-6 rounded-xl text-xs font-bold border border-dark-700 transition-all">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rentals.map((rental) => (
              <div key={rental._id} className="p-6 rounded-2xl border border-dark-800 bg-dark-950/30 flex flex-col justify-between space-y-6">
                {/* Header info */}
                <div className="flex gap-4 items-start">
                  <img
                    src={rental.product?.image}
                    alt={rental.product?.name}
                    className="h-20 w-20 object-cover rounded-xl bg-dark-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="rounded-full bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                      {rental.status}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1 leading-normal truncate">{rental.product?.name}</h3>
                    <p className="text-[10px] text-dark-500 font-medium">Order ID: #{rental._id?.slice(-8)}</p>
                  </div>
                </div>

                {/* Date / Billing details */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-dark-850 py-4 text-xs">
                  <div>
                    <span className="text-[10px] font-medium text-dark-500 uppercase tracking-wider block">Monthly Charge</span>
                    <span className="text-sm font-extrabold text-white">${rental.rentAmount}</span>
                    <span className="text-[9px] text-dark-550 block mt-0.5">Deposit: ${rental.securityDeposit}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-dark-500 uppercase tracking-wider block">Return Date</span>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <FiCalendar className="text-brand-500" />
                      {new Date(rental.returnDate).toLocaleDateString()}
                    </span>
                    <span className="text-[9px] text-brand-400 block mt-0.5">Tenure: {rental.selectedTenure} Months</span>
                  </div>
                </div>

                {/* Operations grid */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openExtension(rental)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-dark-800 hover:bg-dark-750 border border-dark-700 py-2.5 text-xs font-bold text-white transition-all"
                  >
                    <FiTrendingUp className="text-brand-400" />
                    <span>Extend Tenure</span>
                  </button>
                  <Link
                    to={`/maintenance?orderId=${rental._id}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-dark-800 hover:bg-dark-750 border border-dark-700 py-2.5 text-xs font-bold text-white transition-all text-center"
                  >
                    <FiTool className="text-brand-400" />
                    <span>File Maintenance</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extension Modal Backdrop */}
      {showExtensionModal && selectedRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="max-w-md w-full rounded-3xl border border-dark-800 bg-dark-900 p-6 space-y-6 shadow-glass relative animate-scale-in">
            <button
              onClick={() => setShowExtensionModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-dark-800 text-dark-500 hover:text-white"
            >
              <FiX className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h2 className="text-base font-bold text-white">Extend Rental Duration</h2>
              <p className="text-[10px] text-dark-450 leading-relaxed truncate">Product: {selectedRental.product?.name}</p>
            </div>

            {/* Selector Options */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-dark-400">Choose extension period:</label>
              <div className="grid grid-cols-3 gap-3">
                {[3, 6, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => setExtensionMonths(m)}
                    className={`rounded-xl border py-3.5 text-xs font-bold transition-all ${
                      extensionMonths === m
                        ? 'border-brand-500 bg-brand-950/20 text-brand-400 shadow-neon'
                        : 'border-dark-800 bg-dark-950/40 text-dark-550 hover:border-dark-750 hover:text-white'
                    }`}
                  >
                    +{m} Months
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations info */}
            <div className="p-4 rounded-xl border border-dark-800 bg-dark-950 text-xs space-y-2">
              <div className="flex justify-between text-dark-450">
                <span>Current Return Date</span>
                <span>{new Date(selectedRental.returnDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-brand-400 font-bold">
                <span>Extended Return Date</span>
                <span>
                  {(() => {
                    const d = new Date(selectedRental.returnDate);
                    d.setMonth(d.getMonth() + extensionMonths);
                    return d.toLocaleDateString();
                  })()}
                </span>
              </div>
              <div className="flex justify-between text-dark-450">
                <span>Recur monthly rate</span>
                <span>${selectedRental.rentAmount}</span>
              </div>
            </div>

            {/* Messages */}
            {modalSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-900/30 p-3 text-xs text-emerald-400 font-medium">
                <FiCheck />
                <span>{modalSuccess}</span>
              </div>
            )}

            <button
              onClick={handleExtendSubmit}
              disabled={extending}
              className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 py-3 text-xs font-bold text-white shadow-neon transition-all disabled:opacity-50"
            >
              {extending ? 'Processing...' : 'Confirm Tenure Extension'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRentals;

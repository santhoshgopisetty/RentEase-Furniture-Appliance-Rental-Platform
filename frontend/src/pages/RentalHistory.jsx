import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { FiArrowLeft, FiClock } from 'react-icons/fi';

const RentalHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await API.get('/rentals');
        // Filter out Pending & Active
        setHistory(data.filter(r => r.status === 'Returned' || r.status === 'Cancelled'));
      } catch (err) {
        setError('Failed to fetch rental history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

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

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">Rental History Log</h1>

        {error && (
          <p className="text-rose-500 text-xs font-semibold mb-6">{error}</p>
        )}

        {history.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-dark-800 bg-dark-950/20 p-8">
            <div className="p-4 rounded-full bg-dark-850/50 inline-block text-dark-500 mb-4">
              <FiClock className="h-10 w-10" />
            </div>
            <p className="text-dark-400 font-semibold mb-2">No historical records found.</p>
            <p className="text-xs text-dark-500">Completed returns or cancellations will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl">
            {history.map((item) => (
              <div key={item._id} className="p-5 rounded-2xl border border-dark-850 bg-dark-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="h-14 w-14 object-cover rounded-xl bg-dark-800 shrink-0"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-white leading-normal">{item.product?.name}</h3>
                    <p className="text-[10px] text-dark-500 mt-1">
                      Ordered: {new Date(item.deliveryDate).toLocaleDateString()} • Quantity: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-start w-full sm:w-auto border-t sm:border-0 border-dark-850 pt-2 sm:pt-0">
                  <div className="text-right">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      item.status === 'Returned' ? 'bg-dark-800 text-dark-400 border border-dark-700' : 'bg-rose-950/30 text-rose-400 border border-rose-900/30'
                    }`}>
                      {item.status}
                    </span>
                    <p className="text-xs font-bold text-dark-300 mt-1.5">Deposits refunded: ${item.securityDeposit}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalHistory;

import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FiArrowLeft, FiList, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/admin/orders');
      setOrders(data);
    } catch (err) {
      setError('Failed to fetch rental order database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/admin/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error(err);
      setError('Failed to update order status.');
    } finally {
      setUpdatingId(null);
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation / Header */}
        <div className="flex items-center gap-3 border-b border-dark-800 pb-6">
          <Link to="/admin" className="p-2 rounded-lg bg-dark-850 hover:bg-dark-800 text-dark-400 hover:text-white transition-colors">
            <FiArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <FiList className="text-brand-500" />
              <span>Rental Order Log Console</span>
            </h1>
            <p className="text-xs text-dark-450">Review and change status of rental subscriptions (Pending, Active, Returned, Cancelled).</p>
          </div>
        </div>

        {error && (
          <p className="text-rose-500 text-xs font-semibold">{error}</p>
        )}

        {/* Data Table */}
        <div className="overflow-hidden rounded-2xl border border-dark-800 bg-dark-950/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-dark-800 bg-dark-900 text-dark-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Order Details</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4 text-right">Rent/mo</th>
                  <th className="p-4 text-right">Deposit</th>
                  <th className="p-4 text-center">Delivery Date</th>
                  <th className="p-4 text-center">Return Date</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-dark-850 hover:bg-dark-900/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={o.product?.image}
                        alt={o.product?.name}
                        className="h-10 w-10 object-cover rounded-lg bg-dark-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate">{o.product?.name}</span>
                        <span className="text-[9px] text-dark-500 block">ID: #{o._id?.slice(-8)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-bold text-white">{o.user?.name}</div>
                      <div className="text-[9px] text-dark-500">{o.user?.email}</div>
                    </td>
                    <td className="p-4 text-right font-extrabold text-white">${o.rentAmount}</td>
                    <td className="p-4 text-right font-semibold text-dark-350">${o.securityDeposit}</td>
                    <td className="p-4 text-center text-dark-300 font-medium">
                      {new Date(o.deliveryDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center text-dark-300 font-medium">
                      {new Date(o.returnDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        disabled={updatingId === o._id}
                        className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:ring-0 ${
                          o.status === 'Active'
                            ? 'bg-emerald-950/45 text-emerald-400 border-emerald-900/40'
                            : o.status === 'Pending'
                            ? 'bg-amber-950/45 text-amber-400 border-amber-900/40'
                            : o.status === 'Returned'
                            ? 'bg-dark-850 text-dark-400 border-dark-750'
                            : 'bg-rose-950/45 text-rose-400 border-rose-900/40'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Returned">Returned</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

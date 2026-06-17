import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { FiBox, FiTool, FiUser, FiArrowRight, FiClock, FiCalendar } from 'react-icons/fi';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, ticketsRes] = await Promise.all([
          API.get('/rentals'),
          API.get('/maintenance')
        ]);
        setOrders(ordersRes.data);
        setTickets(ticketsRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const activeRentals = orders.filter(o => o.status === 'Active');
  const pendingDeliveries = orders.filter(o => o.status === 'Pending');
  const openTickets = tickets.filter(t => t.status !== 'Resolved');

  // Total Security Deposit currently held
  const totalDeposit = activeRentals.reduce((sum, o) => sum + o.securityDeposit, 0) + 
                       pendingDeliveries.reduce((sum, o) => sum + o.securityDeposit, 0);

  // Total monthly rent payable for active items
  const monthlyPayable = activeRentals.reduce((sum, o) => sum + o.rentAmount, 0);

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
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-dark-800 pb-8 mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">User Dashboard</h1>
            <p className="text-xs text-dark-450 mt-1">
              Welcome back, <span className="text-white font-semibold">{user?.name}</span>. Manage your rentals and claims.
            </p>
          </div>
          <div className="text-xs text-dark-450 bg-dark-950 p-3 rounded-2xl border border-dark-800">
            <span className="font-semibold text-white">Billing Address:</span> {user?.address}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
          <div className="p-6 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-dark-500 tracking-wider">Active Rentals</span>
              <p className="text-2xl font-black text-white">{activeRentals.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
              <FiBox className="h-6 w-6" />
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-dark-500 tracking-wider">Pending Delivery</span>
              <p className="text-2xl font-black text-white">{pendingDeliveries.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <FiClock className="h-6 w-6" />
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-dark-500 tracking-wider">Monthly Rent Outlay</span>
              <p className="text-2xl font-black text-white">${monthlyPayable}<span className="text-xs font-normal text-dark-400">/mo</span></p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <FiCalendar className="h-6 w-6" />
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-dark-500 tracking-wider">Total Refundable Deposits</span>
              <p className="text-2xl font-black text-white">${totalDeposit}</p>
            </div>
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
              <FiTool className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Dynamic Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left/Middle: Recent Active Rentals */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">Active Products</h2>
              <Link to="/rentals/active" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
                <span>Manage Rentals</span>
                <FiArrowRight />
              </Link>
            </div>

            {activeRentals.length === 0 && pendingDeliveries.length === 0 ? (
              <div className="border border-dark-800 bg-dark-950/20 rounded-2xl p-8 text-center text-xs text-dark-450">
                You have no active products or pending deliveries. Furnish your space now!
                <div className="mt-4">
                  <Link to="/products" className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-4 rounded-xl inline-block shadow-neon">
                    Browse Products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {[...pendingDeliveries, ...activeRentals].slice(0, 3).map((item) => (
                  <div key={item._id} className="p-5 rounded-2xl border border-dark-800 bg-dark-950/30 flex items-center gap-4 hover:border-brand-500/55 transition-all">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="h-16 w-16 object-cover rounded-xl bg-dark-800"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-white truncate">{item.product?.name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] text-dark-450 font-medium">
                        <span>Tenure: {item.selectedTenure} months</span>
                        <span>Monthly: ${item.rentAmount}</span>
                        <span>Return: {new Date(item.returnDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'Active' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Quick Links / Maintenance status */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">Maintenance Tickets</h2>

            {openTickets.length === 0 ? (
              <div className="border border-dark-800 bg-dark-950/20 rounded-2xl p-6 text-center text-xs text-dark-450">
                All tickets resolved. Everything is running smoothly!
                <div className="mt-4">
                  <Link to="/maintenance" className="text-brand-400 hover:underline">File a request</Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {openTickets.slice(0, 2).map((ticket) => (
                  <div key={ticket._id} className="p-4 rounded-xl border border-dark-800 bg-dark-950/40 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-brand-400">Order ID: #{ticket.rentalOrder?._id?.slice(-6)}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                        ticket.status === 'Open' ? 'bg-rose-950/40 text-rose-400 border border-rose-900/30' : 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-dark-400 line-clamp-2 italic font-light">"{ticket.issueDescription}"</p>
                    <span className="text-[9px] text-dark-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
                <Link to="/maintenance" className="block text-center text-xs font-semibold text-brand-400 hover:text-brand-350">
                  View all maintenance requests
                </Link>
              </div>
            )}

            {/* Account settings card */}
            <div className="p-6 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-4">
              <div className="flex items-center gap-3">
                <FiUser className="h-5 w-5 text-brand-500" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-semibold">
                <Link to="/profile" className="p-2.5 rounded-xl border border-dark-800 bg-dark-950 hover:border-brand-500 hover:text-brand-400 transition-colors">
                  Edit Profile
                </Link>
                <Link to="/rentals/history" className="p-2.5 rounded-xl border border-dark-800 bg-dark-950 hover:border-brand-500 hover:text-brand-400 transition-colors">
                  Rental History
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

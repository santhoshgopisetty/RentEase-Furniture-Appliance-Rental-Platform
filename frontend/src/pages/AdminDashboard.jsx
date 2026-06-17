import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { FiUsers, FiBox, FiActivity, FiDollarSign, FiTool, FiList, FiCheckCircle } from 'react-icons/fi';

const COLORS = ['#6384ff', '#3447eb', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6'];

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await API.get('/admin/dashboard');
        setAnalytics(data);
      } catch (err) {
        setError('Failed to fetch admin dashboard analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-900 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="bg-dark-900 text-white min-h-screen py-20">
        <div className="mx-auto max-w-xl text-center px-4">
          <p className="text-rose-500 font-semibold mb-4">{error || 'Access denied'}</p>
          <Link to="/" className="bg-brand-600 hover:bg-brand-500 text-white py-2 px-6 rounded-xl text-xs font-bold">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { stats, charts } = analytics;

  return (
    <div className="bg-dark-900 text-white min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-dark-800 pb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Admin Control Panel</h1>
            <p className="text-xs text-dark-450 mt-1">
              Live database monitoring, product inventory adjustments, order logs, and claims resolution.
            </p>
          </div>
          {/* Quick navigation bar */}
          <div className="flex gap-2 flex-wrap">
            <Link to="/admin/products" className="bg-dark-800 hover:bg-dark-750 text-xs font-semibold py-2 px-4 rounded-xl border border-dark-700 transition-colors">
              Manage Products
            </Link>
            <Link to="/admin/orders" className="bg-dark-800 hover:bg-dark-750 text-xs font-semibold py-2 px-4 rounded-xl border border-dark-700 transition-colors">
              Manage Orders
            </Link>
            <Link to="/admin/maintenance" className="bg-dark-800 hover:bg-dark-750 text-xs font-semibold py-2 px-4 rounded-xl border border-dark-700 transition-colors">
              Support Tickets
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="p-5 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-2">
            <div className="flex items-center justify-between text-brand-400">
              <span className="text-[9px] uppercase font-bold text-dark-500 tracking-wider">Total Users</span>
              <FiUsers className="h-4 w-4" />
            </div>
            <p className="text-xl font-extrabold text-white">{stats.totalUsers}</p>
          </div>

          <div className="p-5 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-2">
            <div className="flex items-center justify-between text-brand-400">
              <span className="text-[9px] uppercase font-bold text-dark-500 tracking-wider">Products</span>
              <FiBox className="h-4 w-4" />
            </div>
            <p className="text-xl font-extrabold text-white">{stats.totalProducts}</p>
          </div>

          <div className="p-5 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-2">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[9px] uppercase font-bold text-dark-500 tracking-wider">Active Rentals</span>
              <FiActivity className="h-4 w-4" />
            </div>
            <p className="text-xl font-extrabold text-white">{stats.activeRentals}</p>
          </div>

          <div className="p-5 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-2">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-[9px] uppercase font-bold text-dark-500 tracking-wider">MRR Revenue</span>
              <FiDollarSign className="h-4 w-4" />
            </div>
            <p className="text-xl font-extrabold text-white">${stats.monthlyRevenue}</p>
          </div>

          <div className="p-5 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-2">
            <div className="flex items-center justify-between text-rose-400">
              <span className="text-[9px] uppercase font-bold text-dark-500 tracking-wider">Open Tickets</span>
              <FiTool className="h-4 w-4" />
            </div>
            <p className="text-xl font-extrabold text-white">{stats.openMaintenance}</p>
          </div>

          <div className="p-5 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-2">
            <div className="flex items-center justify-between text-brand-400">
              <span className="text-[9px] uppercase font-bold text-dark-500 tracking-wider">Utilization</span>
              <FiCheckCircle className="h-4 w-4" />
            </div>
            <p className="text-xl font-extrabold text-white">{stats.utilizationRate}%</p>
          </div>
        </div>

        {/* Charts & Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="md:col-span-2 p-6 rounded-3xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-4">
            <h3 className="text-xs font-bold text-dark-300 uppercase tracking-wider">Monthly Revenue Trend</h3>
            <div className="h-[250px] w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.revenueByMonth}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6384ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6384ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2225" />
                  <XAxis dataKey="month" stroke="#545b63" />
                  <YAxis stroke="#545b63" />
                  <Tooltip contentStyle={{ backgroundColor: '#121416', border: '1px solid #32373c', color: '#fff' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#6384ff" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categories Pie Chart */}
          <div className="p-6 rounded-3xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-4">
            <h3 className="text-xs font-bold text-dark-300 uppercase tracking-wider">Catalog by Category</h3>
            <div className="h-[250px] w-full flex justify-center items-center text-xs">
              {charts.categoryData.length === 0 ? (
                <p className="text-dark-500 text-xs">No product data seeded</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {charts.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#121416', border: '1px solid #32373c', color: '#fff' }} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '9px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Order Status Distribution Bar Chart */}
          <div className="md:col-span-3 p-6 rounded-3xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-4">
            <h3 className="text-xs font-bold text-dark-300 uppercase tracking-wider">Order Status Distribution</h3>
            <div className="h-[200px] w-full text-xs">
              {charts.orderStatusData.length === 0 ? (
                <p className="text-dark-500 text-xs text-center py-20">No order data available</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.orderStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2225" />
                    <XAxis dataKey="status" stroke="#545b63" />
                    <YAxis stroke="#545b63" />
                    <Tooltip contentStyle={{ backgroundColor: '#121416', border: '1px solid #32373c', color: '#fff' }} />
                    <Bar dataKey="count" fill="#475fff" radius={[6, 6, 0, 0]}>
                      {charts.orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.status === 'Active' ? '#10b981' : entry.status === 'Pending' ? '#f59e0b' : entry.status === 'Returned' ? '#9aa0a6' : '#f43f5e'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

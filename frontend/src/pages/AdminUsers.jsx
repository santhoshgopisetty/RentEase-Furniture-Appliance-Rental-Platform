import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FiArrowLeft, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get('/admin/users');
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch user database.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation / Header */}
        <div className="flex items-center gap-3 border-b border-dark-800 pb-6">
          <Link to="/admin" className="p-2 rounded-lg bg-dark-850 hover:bg-dark-800 text-dark-400 hover:text-white transition-colors">
            <FiArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <FiUsers className="text-brand-500" />
              <span>Registered Clients Directory</span>
            </h1>
            <p className="text-xs text-dark-450">Directory lists all active non-admin accounts registered in RentEase.</p>
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
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Default Billing Address</th>
                  <th className="p-4">Member Since</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-dark-850 hover:bg-dark-900/40 transition-colors">
                    <td className="p-4 font-bold text-white">{u.name}</td>
                    <td className="p-4 text-dark-300 font-semibold">{u.email}</td>
                    <td className="p-4 text-dark-350">{u.phone}</td>
                    <td className="p-4 text-dark-400 leading-normal max-w-xs truncate" title={u.address}>
                      {u.address}
                    </td>
                    <td className="p-4 text-dark-500">
                      {new Date(u.createdAt).toLocaleDateString()}
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

export default AdminUsers;

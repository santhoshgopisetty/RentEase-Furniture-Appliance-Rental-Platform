import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FiArrowLeft, FiTool, FiCheckCircle, FiPlay, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminMaintenance = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTickets = async () => {
    try {
      const { data } = await API.get('/maintenance');
      setTickets(data);
    } catch (err) {
      setError('Failed to fetch maintenance requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (ticketId, newStatus) => {
    setUpdatingId(ticketId);
    try {
      await API.put(`/maintenance/${ticketId}`, { status: newStatus });
      setTickets(tickets.map(t => t._id === ticketId ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error(err);
      setError('Failed to update ticket status.');
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
              <FiTool className="text-brand-500" />
              <span>Client Maintenance Claims Center</span>
            </h1>
            <p className="text-xs text-dark-450">Review support tickets filed by clients and update working status details.</p>
          </div>
        </div>

        {error && (
          <p className="text-rose-500 text-xs font-semibold">{error}</p>
        )}

        {tickets.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-dark-800 bg-dark-950/20 p-8 text-dark-400">
            No support tickets have been filed.
          </div>
        ) : (
          <div className="space-y-4 max-w-5xl">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="p-5 rounded-2xl border border-dark-800 bg-dark-950/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-3 flex-1 min-w-0">
                  {/* Title & Customer contact */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                      ticket.status === 'Open'
                        ? 'bg-rose-950/40 text-rose-400 border border-rose-900/30'
                        : ticket.status === 'In Progress'
                        ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                        : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className="text-[10px] text-dark-500">Ticket ID: #{ticket._id?.slice(-8)}</span>
                    <span className="text-[10px] text-dark-500">• Filed on {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white truncate">
                    {ticket.rentalOrder?.product?.name || 'Deleted Product'}
                  </h3>

                  <div className="p-3.5 rounded-xl border border-dark-850 bg-dark-950 text-xs italic text-dark-350 leading-relaxed font-light">
                    "{ticket.issueDescription}"
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-dark-450 font-semibold">
                    <span>Customer: <span className="text-white">{ticket.user?.name}</span></span>
                    <span>Email: <span className="text-white">{ticket.user?.email}</span></span>
                    <span>Phone: <span className="text-white">{ticket.user?.phone}</span></span>
                  </div>
                </div>

                {/* Operations side */}
                <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto border-t sm:border-0 border-dark-850 pt-3 sm:pt-0 justify-end">
                  {ticket.status === 'Open' && (
                    <button
                      onClick={() => handleUpdateStatus(ticket._id, 'In Progress')}
                      disabled={updatingId === ticket._id}
                      className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 py-2 px-4 text-xs font-bold text-white shadow-neon transition-all"
                    >
                      <FiPlay />
                      <span>Start Working</span>
                    </button>
                  )}
                  {ticket.status === 'In Progress' && (
                    <button
                      onClick={() => handleUpdateStatus(ticket._id, 'Resolved')}
                      disabled={updatingId === ticket._id}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 px-4 text-xs font-bold text-white shadow-neon transition-all"
                    >
                      <FiCheckCircle />
                      <span>Resolve Claim</span>
                    </button>
                  )}
                  {ticket.status === 'Resolved' && (
                    <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-emerald-900/20 bg-emerald-950/20 text-emerald-400 text-xs font-bold">
                      <FiCheckCircle />
                      <span>Ticket Resolved</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMaintenance;

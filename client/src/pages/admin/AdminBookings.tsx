import React, { useEffect, useState } from 'react';
import { Search, Download, RotateCcw, Filter, Calendar } from 'lucide-react';
import {
  getAdminBookings,
  confirmBooking,
  cancelBooking,
  exportBookingsCsv,
  getAdminHalls,
} from '../../api/admin.api';
import { Booking, Hall } from '../../types';
import { BookingTable } from '../../components/admin/BookingTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [status, setStatus] = useState<string>('ALL');
  const [selectedHallId, setSelectedHallId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const loadHalls = async () => {
    try {
      const data = await getAdminHalls();
      setHalls(data);
    } catch (e) {
      // ignore
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getAdminBookings({
        status: status !== 'ALL' ? status : undefined,
        hallId: selectedHallId ? Number(selectedHallId) : undefined,
        date: date || undefined,
        search: search.trim() || undefined,
      });
      setBookings(data);
    } catch (err: any) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHalls();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBookings();
    }, 200);
    return () => clearTimeout(timer);
  }, [status, selectedHallId, date, search]);

  const handleConfirm = async (id: number) => {
    try {
      await confirmBooking(id);
      toast.success('Booking confirmed!');
      loadBookings();
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelBooking(id, 'Admin cancellation');
      toast.success('Booking cancelled');
      loadBookings();
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  };

  const handleExportCsv = async () => {
    try {
      const blob = await exportBookingsCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Bookings exported to CSV');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  const handleReset = () => {
    setStatus('ALL');
    setSelectedHallId('');
    setDate('');
    setSearch('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Booking Records & Reservations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review event slots, verify customer payments, and manage confirmations.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ref, Name, Email, Phone..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 outline-none bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Approval</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Hall Filter */}
          <div>
            <select
              value={selectedHallId}
              onChange={(e) => setSelectedHallId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 outline-none bg-white"
            >
              <option value="">All Venues</option>
              {halls.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 outline-none bg-white"
            />
          </div>
        </div>

        {(status !== 'ALL' || selectedHallId || date || search) && (
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={handleReset}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-indigo-600"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <BookingTable
        bookings={bookings}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isLoading={loading}
      />
    </div>
  );
};

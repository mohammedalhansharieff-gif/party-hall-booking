import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  IndianRupee,
  Users,
  Castle,
  Download,
  Percent,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { getDashboardStats, getAdminBookings, confirmBooking, cancelBooking, exportBookingsCsv } from '../../api/admin.api';
import { DashboardStats, Booking } from '../../types';
import { StatsCard } from '../../components/admin/StatsCard';
import { BookingTable } from '../../components/admin/BookingTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { admin } = useAuthStore();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, bookingsData] = await Promise.all([
        getDashboardStats(),
        getAdminBookings(),
      ]);
      setStats(statsData);
      setRecentBookings(bookingsData.slice(0, 5));
    } catch (err: any) {
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConfirm = async (id: number) => {
    try {
      await confirmBooking(id);
      toast.success('Booking confirmed!');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelBooking(id, 'Admin cancellation');
      toast.success('Booking cancelled');
      loadData();
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
      a.download = `hall-bookings-report-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('CSV Report downloaded successfully');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading venue analytics..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Manager Control Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong>{admin?.name}</strong> ({admin?.email})
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Bookings CSV</span>
          </button>
          <Link
            to="/admin/halls"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-100 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage Halls</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            title="Total Bookings"
            value={stats.totalBookings}
            subtitle="All recorded events"
            icon={CalendarDays}
            colorScheme="indigo"
          />
          <StatsCard
            title="Pending Approval"
            value={stats.pendingBookings}
            subtitle="Awaiting review"
            icon={Clock}
            colorScheme="amber"
          />
          <StatsCard
            title="Monthly Revenue"
            value={`₹${stats.monthlyRevenue.toLocaleString('en-IN')}`}
            subtitle="Confirmed & completed"
            icon={IndianRupee}
            colorScheme="emerald"
          />
          <StatsCard
            title="Est. Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            subtitle="Based on available slots"
            icon={Percent}
            colorScheme="purple"
          />
        </div>
      )}

      {/* Navigation shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/admin/bookings"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition group flex items-center justify-between"
        >
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition">
              All Bookings Management & Filters
            </h3>
            <p className="text-xs text-slate-500">
              Filter by hall, date range, customer name, and confirm/reject reservations.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition" />
        </Link>

        <Link
          to="/admin/halls"
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition group flex items-center justify-between"
        >
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition">
              Banquet Halls & Tariffs Directory
            </h3>
            <p className="text-xs text-slate-500">
              Create new venues, update slot rates, and toggle availability.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition" />
        </Link>
      </div>

      {/* Recent Bookings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-slate-900">
            Recent Booking Inquiries
          </h2>
          <Link
            to="/admin/bookings"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View All Bookings →
          </Link>
        </div>

        <BookingTable
          bookings={recentBookings}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

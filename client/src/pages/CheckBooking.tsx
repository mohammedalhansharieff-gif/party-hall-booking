import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Calendar, Clock, MapPin, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { getBookingByRef, cancelBooking } from '../api/bookings.api';
import { Booking } from '../types';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const CheckBooking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [bookingRef, setBookingRef] = useState(initialRef);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const handleSearch = async (refToSearch?: string) => {
    const ref = (refToSearch || bookingRef).trim();
    if (!ref) {
      toast.error('Please enter a booking reference number');
      return;
    }

    try {
      setLoading(true);
      const data = await getBookingByRef(ref);
      setBooking(data);
    } catch (err: any) {
      toast.error(err.message || 'No booking found with this reference');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      handleSearch(initialRef);
    }
  }, [initialRef]);

  const handleCancel = async () => {
    if (!booking) return;
    try {
      setCancelling(true);
      const updated = await cancelBooking(booking.bookingRef, cancelReason);
      setBooking(updated);
      setShowCancelModal(false);
      toast.success('Booking cancelled successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Check Booking Status
        </h1>
        <p className="text-sm text-slate-600">
          Enter your unique booking reference number (e.g. HALL-2026-XXXXX) to track or manage your reservation.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-[#FCFAF7] p-5 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
              placeholder="e.g. HALL-2026-EXMP1"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-[#A17619] via-[#B88924] to-[#C39626] hover:brightness-105 text-white font-semibold text-sm rounded-xl transition shadow-sm shadow-amber-900/10"
          >
            Track Status
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner message="Searching booking record..." />}

      {booking && !loading && (
        <div className="bg-[#FCFAF7] rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Booking Reference
              </span>
              <span className="font-mono text-2xl font-bold text-indigo-600">
                {booking.bookingRef}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <Badge status={booking.status} size="md" />
              <Badge status={booking.paymentStatus} size="md" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-serif text-base font-bold text-slate-900">Venue Information</h4>
              <p className="font-semibold text-slate-800 text-base">{booking.hall?.name}</p>
              <p className="flex items-center space-x-2 text-slate-500 text-xs">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>{booking.hall?.location || 'Central City'}</span>
              </p>
              <div className="pt-2 text-xs text-slate-600 space-y-1">
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(booking.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p>
                  <strong>Time Slot:</strong> {booking.timeSlot?.label} ({booking.timeSlot?.startTime} –{' '}
                  {booking.timeSlot?.endTime})
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif text-base font-bold text-slate-900">Customer Details</h4>
              <p className="font-semibold text-slate-800">{booking.customerName}</p>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Email:</strong> {booking.customerEmail}</p>
                <p><strong>Phone:</strong> {booking.customerPhone}</p>
                <p><strong>Estimated Guests:</strong> {booking.guestCount || 'Not specified'}</p>
                <p><strong>Special Requests:</strong> {booking.specialRequests || 'None'}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 block">Total Rental Fee</span>
              <span className="text-xl font-bold text-slate-900">
                ₹{booking.totalAmount?.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Payment Status</span>
              <span className="text-sm font-bold text-slate-800">{booking.paymentStatus}</span>
            </div>
          </div>

          {/* Cancellation Actions */}
          {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
              >
                Request Booking Cancellation
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-slate-900">Cancel Booking</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel booking <strong>{booking?.bookingRef}</strong>? The time slot will become available for other customers.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Reason for cancellation (Optional)
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Change of event schedule..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm"
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

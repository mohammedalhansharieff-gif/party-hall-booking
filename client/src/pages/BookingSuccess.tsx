import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Copy, Check, Calendar, Clock, MapPin, ArrowRight, Printer } from 'lucide-react';
import { getBookingByRef } from '../api/bookings.api';
import { Booking } from '../types';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const BookingSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingRef = searchParams.get('ref') || '';

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingRef) return;
      try {
        setLoading(true);
        const data = await getBookingByRef(bookingRef);
        setBooking(data);
      } catch (err: any) {
        toast.error('Could not fetch booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingRef]);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(bookingRef);
    setCopied(true);
    toast.success('Booking reference copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <LoadingSpinner message="Loading your confirmed booking details..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Booking Confirmed!
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Thank you for choosing GrandVenues. Your reservation has been recorded and an email notification has been generated.
        </p>
      </div>

      {/* Reference Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-8 space-y-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Booking Reference Number
            </span>
            <span className="font-mono text-2xl font-bold text-indigo-600">{bookingRef}</span>
          </div>

          <button
            onClick={handleCopyRef}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Reference'}</span>
          </button>
        </div>

        {booking && (
          <div className="space-y-4 pt-2">
            <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Event Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Venue Hall</span>
                <span className="font-semibold text-slate-800">{booking.hall?.name}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block font-medium">Booking Status</span>
                <div className="mt-1">
                  <Badge status={booking.status} size="sm" />
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block font-medium">Event Date</span>
                <span className="font-semibold text-slate-800">
                  {new Date(booking.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block font-medium">Time Slot</span>
                <span className="font-semibold text-slate-800">
                  {booking.timeSlot?.label} ({booking.timeSlot?.startTime} – {booking.timeSlot?.endTime})
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block font-medium">Customer Name</span>
                <span className="font-semibold text-slate-800">{booking.customerName}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block font-medium">Total Paid / Due</span>
                <span className="font-bold text-slate-900 text-base">
                  ₹{booking.totalAmount?.toLocaleString('en-IN')} ({booking.paymentStatus})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Arrival & Guidelines */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4.5 space-y-2 text-xs text-amber-900">
          <p className="font-bold text-amber-950">Important Venue Guidelines:</p>
          <ul className="list-disc list-inside space-y-1 text-amber-900/90 leading-relaxed">
            <li>Please arrive at the hall at least 30 minutes prior to slot commencement.</li>
            <li>Keep this Booking Reference handy at the security reception desk.</li>
            <li>Decorations, staging, and catering coordination can begin up to 1 hour before the slot.</li>
            <li>Free cancellation is available up to 7 days before the event date.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 border-t border-slate-100">
          <Link
            to={`/check-booking?ref=${bookingRef}`}
            className="w-full sm:w-1/2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-center text-sm font-semibold transition shadow-md shadow-indigo-100 flex items-center justify-center space-x-2"
          >
            <span>View Full Booking Record</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="w-full sm:w-1/2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-center text-sm font-semibold transition"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

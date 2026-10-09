import React from 'react';
import { Check, X, Eye, Phone, Mail, Calendar, Clock } from 'lucide-react';
import { Booking } from '../../types';
import { Badge } from '../common/Badge';

interface BookingTableProps {
  bookings: Booking[];
  onConfirm: (id: number) => void;
  onCancel: (id: number) => void;
  onViewDetails?: (booking: Booking) => void;
  isLoading?: boolean;
}

export const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  onConfirm,
  onCancel,
  onViewDetails,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="py-12 text-center text-slate-400">
        <p>Loading bookings...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        <p className="text-sm">No bookings matched your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Booking Ref</th>
              <th className="py-3.5 px-4">Hall Name</th>
              <th className="py-3.5 px-4">Event Date & Slot</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Guests</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {bookings.map((b) => {
              const formattedDate = new Date(b.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Ref */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-indigo-600 text-xs">
                    {b.bookingRef}
                  </td>

                  {/* Hall */}
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {b.hall?.name || 'Venue Hall'}
                  </td>

                  {/* Date & Slot */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5 text-slate-900 font-medium text-xs">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{b.timeSlot?.label}</span>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900 text-xs">{b.customerName}</div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                      <span className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{b.customerPhone}</span>
                      </span>
                    </div>
                  </td>

                  {/* Guests */}
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    {b.guestCount ? `${b.guestCount} guests` : '—'}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 font-semibold text-slate-900 text-xs">
                    ₹{b.totalAmount?.toLocaleString('en-IN')}
                    <div className="text-[10px] font-normal text-slate-400">
                      {b.paymentStatus}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <Badge status={b.status} size="sm" />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {onViewDetails && (
                      <button
                        onClick={() => onViewDetails(b)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    {b.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => onConfirm(b.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition border border-emerald-200"
                          title="Confirm Booking"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => onCancel(b.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition border border-rose-200"
                          title="Cancel Booking"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {b.status === 'CONFIRMED' && (
                      <button
                        onClick={() => onCancel(b.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

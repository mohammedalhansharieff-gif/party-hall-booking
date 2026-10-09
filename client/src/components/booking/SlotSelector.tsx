import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { SlotAvailability } from '../../types';

interface SlotSelectorProps {
  slots: SlotAvailability[];
  selectedSlot: SlotAvailability | null;
  onSelectSlot: (slot: SlotAvailability) => void;
  isLoading?: boolean;
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-sm">Fetching real-time slot availability...</p>
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-sm">Please select an event date to view available time slots.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {slots.map((slot) => {
        const isSelected = selectedSlot?.id === slot.id;
        const isAvailable = slot.available;

        let statusBadge = (
          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Available
          </span>
        );

        if (!isAvailable) {
          if (slot.status === 'PENDING') {
            statusBadge = (
              <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-full">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                Pending
              </span>
            );
          } else {
            statusBadge = (
              <span className="inline-flex items-center text-xs font-semibold text-rose-700 bg-rose-100/80 px-2.5 py-1 rounded-full">
                <XCircle className="w-3.5 h-3.5 mr-1" />
                Reserved / Booked
              </span>
            );
          }
        }

        return (
          <div
            key={slot.id}
            onClick={() => {
              if (isAvailable) onSelectSlot(slot);
            }}
            className={`border rounded-2xl p-4 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              !isAvailable
                ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                : isSelected
                ? 'bg-indigo-50/70 border-indigo-600 shadow-sm ring-1 ring-indigo-500 cursor-pointer'
                : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm cursor-pointer'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-900 text-base">{slot.label}</span>
                {statusBadge}
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {slot.startTime} – {slot.endTime}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end space-x-4">
              <div className="text-right">
                <div className="text-xs text-slate-500">Rental Rate</div>
                <div className="text-base font-bold text-slate-900">
                  ₹{slot.price.toLocaleString('en-IN')}
                </div>
              </div>

              {isAvailable && (
                <button
                  type="button"
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-indigo-100 hover:text-indigo-700'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

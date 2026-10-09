import React, { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  isBefore,
  startOfDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface AvailabilityCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  onDateSelect: (dateStr: string) => void;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date()
  );

  const today = startOfDay(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => {
    // don't allow navigating prior to current month
    if (!isSameMonth(currentMonth, today)) {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
  };

  // Build calendar matrix
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const selectedDateObj = selectedDate ? new Date(`${selectedDate}T00:00:00`) : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={prevMonth}
            disabled={isSameMonth(currentMonth, today)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
          <div key={i} className="text-xs font-semibold text-slate-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, index) => {
          const isPast = isBefore(d, today);
          const isSelected = selectedDateObj && isSameDay(d, selectedDateObj);
          const isCurrentMonth = isSameMonth(d, monthStart);
          const isCurrentDay = isSameDay(d, today);

          return (
            <button
              key={index}
              type="button"
              disabled={isPast || !isCurrentMonth}
              onClick={() => onDateSelect(format(d, 'yyyy-MM-dd'))}
              className={`h-10 text-sm font-medium rounded-xl flex flex-col items-center justify-center transition-all relative ${
                !isCurrentMonth
                  ? 'text-slate-300 pointer-events-none'
                  : isPast
                  ? 'text-slate-300 cursor-not-allowed bg-slate-50/50'
                  : isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 font-bold'
                  : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <span>{format(d, 'd')}</span>
              {isCurrentDay && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-indigo-600 absolute bottom-1.5"></span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>* Select any upcoming date to inspect available time slots</span>
      </div>
    </div>
  );
};

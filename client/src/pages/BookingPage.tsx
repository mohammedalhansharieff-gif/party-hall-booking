import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { BookingForm } from '../components/booking/BookingForm';

export const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedHall, selectedDate, selectedSlot } = useBookingStore();

  useEffect(() => {
    // If user navigated directly without selecting hall/date/slot
    if (!selectedHall || !selectedDate || !selectedSlot) {
      navigate('/halls');
    }
  }, [selectedHall, selectedDate, selectedSlot, navigate]);

  if (!selectedHall || !selectedDate || !selectedSlot) {
    return null;
  }

  const formattedDate = new Date(selectedDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to={`/halls/${selectedHall.id}`}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Slot / Back to Hall Details</span>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Complete Your Reservation
        </h1>
        <p className="text-sm text-slate-600">
          Provide primary customer details to reserve your venue slot.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="aspect-video relative bg-slate-900">
              <img
                src={
                  selectedHall.images?.[0] ||
                  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'
                }
                alt={selectedHall.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
                  Selected Venue
                </span>
                <h3 className="font-serif text-xl font-bold">{selectedHall.name}</h3>
              </div>
            </div>

            <div className="p-5 space-y-4 text-sm divide-y divide-slate-100">
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center space-x-3 text-slate-700">
                  <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="font-semibold">{formattedDate}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700">
                  <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    <strong>{selectedSlot.label}</strong> ({selectedSlot.startTime} –{' '}
                    {selectedSlot.endTime})
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{selectedHall.location || 'Central City'}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700">
                  <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Max Capacity: {selectedHall.capacity} guests</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Slot Rate
                </span>
                <span className="text-lg font-bold text-slate-900">
                  ₹{selectedSlot.price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4.5 flex items-start space-x-3 text-xs text-indigo-900 leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-indigo-950 mb-0.5">Double-Booking Guarantee</p>
              <p className="text-indigo-800">
                This slot is protected with database transaction locks. No other customer can book this date & slot simultaneously.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="lg:col-span-7">
          <BookingForm hall={selectedHall} date={selectedDate} slot={selectedSlot} />
        </div>
      </div>
    </div>
  );
};

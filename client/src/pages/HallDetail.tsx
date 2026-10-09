import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  MapPin,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { getHallById } from '../api/halls.api';
import { getAvailability } from '../api/availability.api';
import { Hall, SlotAvailability } from '../types';
import { HallGallery } from '../components/halls/HallGallery';
import { AmenitiesList } from '../components/halls/AmenitiesList';
import { AvailabilityCalendar } from '../components/booking/AvailabilityCalendar';
import { SlotSelector } from '../components/booking/SlotSelector';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useBookingStore } from '../store/bookingStore';
import toast from 'react-hot-toast';

export const HallDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [hall, setHall] = useState<Hall | null>(null);
  const [loading, setLoading] = useState(true);

  // Availability state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotAvailability | null>(null);

  const { setSelectedHall, setSelectedDate: setStoreDate, setSelectedSlot: setStoreSlot } =
    useBookingStore();

  useEffect(() => {
    const fetchHall = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getHallById(Number(id));
        setHall(data);
      } catch (err: any) {
        toast.error(err.message || 'Hall not found');
        navigate('/halls');
      } finally {
        setLoading(false);
      }
    };
    fetchHall();
  }, [id, navigate]);

  // Load slot availability whenever selectedDate changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!hall || !selectedDate) return;
      try {
        setLoadingSlots(true);
        const res = await getAvailability(hall.id, selectedDate);
        setSlots(res.slots);
        // Deselect slot if previously selected is no longer available
        setSelectedSlot(null);
      } catch (err: any) {
        toast.error('Failed to retrieve slot availability');
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [hall, selectedDate]);

  const handleProceedToBooking = () => {
    if (!hall || !selectedDate || !selectedSlot) {
      toast.error('Please choose an available time slot first.');
      return;
    }
    // Set global booking store
    setSelectedHall(hall);
    setStoreDate(selectedDate);
    setStoreSlot(selectedSlot);
    navigate('/book');
  };

  if (loading) {
    return <LoadingSpinner message="Loading venue details..." className="min-h-[60vh]" />;
  }

  if (!hall) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" />
          <span>{hall.location || 'Central City'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
          {hall.name}
        </h1>
      </div>

      {/* Main Grid: Gallery + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Photos & Details */}
        <div className="lg:col-span-7 space-y-8">
          <HallGallery images={hall.images} hallName={hall.name} />

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Venue Overview
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {hall.description ||
                'This premium venue offers state-of-the-art facilities, bespoke ambience for wedding ceremonies, engagement celebrations, birthday parties, and corporate galas.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block font-medium">Guest Capacity</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">
                  Up to {hall.capacity.toLocaleString()} guests
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block font-medium">Starting Rate</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">
                  ₹{hall.pricePerSlot.toLocaleString('en-IN')} / slot
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-xs text-slate-400 block font-medium">Booking Policy</span>
                <span className="text-base font-bold text-emerald-600 mt-0.5 block">
                  Guaranteed Hold
                </span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Included Amenities & Infrastructure
            </h3>
            <AmenitiesList amenities={hall.amenities || []} />
          </div>

          {/* Pricing breakdown table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-serif text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Standard Slot Tariff
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs font-semibold uppercase text-slate-400 border-b border-slate-100">
                    <th className="pb-3">Slot Type</th>
                    <th className="pb-3">Timings</th>
                    <th className="pb-3 text-right">Rent Tariff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hall.timeSlots?.map((s) => (
                    <tr key={s.id}>
                      <td className="py-3 font-semibold text-slate-800">{s.label}</td>
                      <td className="py-3 text-slate-500">
                        {s.startTime} – {s.endTime}
                      </td>
                      <td className="py-3 text-right font-bold text-indigo-600">
                        ₹{s.price.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Core Availability Checker */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-white rounded-3xl border-2 border-indigo-100 shadow-xl p-6 sm:p-7 space-y-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Availability Checker</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Check Date & Select Slot
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose your event date below to see live morning, evening, and full-day openings.
              </p>
            </div>

            {/* Date Calendar */}
            <AvailabilityCalendar
              selectedDate={selectedDate}
              onDateSelect={(dateStr) => setSelectedDate(dateStr)}
            />

            {/* Slots */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Available Slots for {new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </label>
              </div>

              <SlotSelector
                slots={slots}
                selectedSlot={selectedSlot}
                onSelectSlot={(slot) => setSelectedSlot(slot)}
                isLoading={loadingSlots}
              />
            </div>

            {/* CTA Book Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleProceedToBooking}
                disabled={!selectedSlot || !selectedSlot.available}
                className="w-full bg-gradient-to-r from-[#A17619] via-[#B88924] to-[#C39626] hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-amber-900/15 transition-all flex items-center justify-center space-x-2 text-base active:scale-95 cursor-pointer"
              >
                <span>Proceed to Book Slot</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              {!selectedSlot && (
                <p className="text-center text-xs text-slate-400 mt-2">
                  Select an available slot above to continue to booking
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

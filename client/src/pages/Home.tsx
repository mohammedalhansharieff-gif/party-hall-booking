import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CalendarCheck2,
  ShieldCheck,
  Award,
  ArrowRight,
  Users,
  Clock,
  Star,
  CheckCircle,
} from 'lucide-react';
import { getHalls } from '../api/halls.api';
import { Hall } from '../types';
import { HallCard } from '../components/halls/HallCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Home: React.FC = () => {
  const [featuredHalls, setFeaturedHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const halls = await getHalls();
        setFeaturedHalls(halls.slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured halls', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHalls();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-[#F5EEE5]/30 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[#F9F0D3]/90 border border-[#E7CA70]/70 px-4 py-1.5 rounded-full text-[#835D12] text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#A17619]" />
              <span>Premium Party & Wedding Venues</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
              Celebrate Your Most Cherished Moments In <span className="text-gold-gradient">Elegance</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Browse world-class wedding ballrooms, open garden pavilions, and convention halls. Check live slot availability by date and secure your booking seamlessly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/halls"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-[#A17619] via-[#B88924] to-[#C39626] hover:brightness-105 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-amber-900/15 transition-all active:scale-95 text-base"
              >
                <span>Check Hall Availability</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/check-booking"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#FCFAF7] hover:bg-white text-slate-700 font-semibold px-8 py-3.5 rounded-xl border border-slate-200 shadow-sm transition-all text-base hover:border-slate-300"
              >
                <CalendarCheck2 className="w-4 h-4 text-indigo-600" />
                <span>Track My Booking</span>
              </Link>
            </div>

            {/* Quick stats banner */}
            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-slate-200/80 max-w-xl mx-auto text-center">
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">100%</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Live Availability</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">0</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Double Booking Guard</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">2,500+</p>
                <p className="text-xs text-slate-500 font-medium mt-1">Happy Celebrations</p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Featured Halls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 block mb-2">
              Signature Venues
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              Featured Banquet & Party Halls
            </h2>
          </div>
          <Link
            to="/halls"
            className="inline-flex items-center space-x-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 mt-4 md:mt-0 group"
          >
            <span>View All Venues</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading venues..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHalls.map((hall) => (
              <HallCard key={hall.id} hall={hall} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-400 block mb-2">
              Effortless Reservations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              How GrandVenues Booking Works
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Book your dream venue in 3 simple steps without visiting physical offices or waiting in lines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-800/80 border border-slate-700/60 p-8 rounded-2xl relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500 text-indigo-400 flex items-center justify-center font-bold text-lg">
                01
              </div>
              <h3 className="font-serif text-xl font-bold">Choose Hall & Date</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Explore hall capacities, photos, and amenities. Pick your desired event date to view live availability across Morning, Evening, or Full Day slots.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/80 border border-slate-700/60 p-8 rounded-2xl relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500 text-indigo-400 flex items-center justify-center font-bold text-lg">
                02
              </div>
              <h3 className="font-serif text-xl font-bold">Instant Slot Hold</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Lock your desired time slot instantly. Our automated concurrency engine prevents double bookings and guarantees zero overlaps.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/80 border border-slate-700/60 p-8 rounded-2xl relative space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500 text-indigo-400 flex items-center justify-center font-bold text-lg">
                03
              </div>
              <h3 className="font-serif text-xl font-bold">Confirmation & Passes</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Receive booking reference receipts directly via email. Pay securely online or settle at the venue manager desk before the celebration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 block mb-2">
            Client Stories
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-900">
            Loved By Families & Event Organizers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FCFAF7] p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#E7CA70]/60 transition-colors space-y-4">
            <div className="flex text-amber-500 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic leading-relaxed">
              "Booking the Grand Imperial Ballroom online was effortless! Checking the availability calendar in real-time saved us multiple trips across town."
            </p>
            <div className="border-t border-slate-200/60 pt-3">
              <p className="font-bold text-slate-900 text-sm">Ananya & Siddharth</p>
              <p className="text-xs text-slate-400">Wedding Reception, December</p>
            </div>
          </div>

          <div className="bg-[#FCFAF7] p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#E7CA70]/60 transition-colors space-y-4">
            <div className="flex text-amber-500 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic leading-relaxed">
              "The glass pavilion was breathtaking for our corporate gala. The confirmation email arrived instantly with arrival guides and contact details."
            </p>
            <div className="border-t border-slate-200/60 pt-3">
              <p className="font-bold text-slate-900 text-sm">Vikram Mehta</p>
              <p className="text-xs text-slate-400">Corporate Director</p>
            </div>
          </div>

          <div className="bg-[#FCFAF7] p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#E7CA70]/60 transition-colors space-y-4">
            <div className="flex text-amber-500 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <p className="text-sm text-slate-600 italic leading-relaxed">
              "Transparent pricing with no hidden charges. The slot selector clearly showed morning and evening options. Highly recommend GrandVenues!"
            </p>
            <div className="border-t border-slate-200/60 pt-3">
              <p className="font-bold text-slate-900 text-sm">Kavita Iyer</p>
              <p className="text-xs text-slate-400">Engagement Ceremony</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

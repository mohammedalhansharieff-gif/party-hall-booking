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
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { getHalls } from '../api/halls.api';
import { Hall } from '../types';
import { HallCard } from '../components/halls/HallCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Home: React.FC = () => {
  const [featuredHalls, setFeaturedHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const faqs = [
    {
      q: 'How do the slot choices (Morning, Evening, Full Day) work?',
      a: 'We offer three distinct booking slots: Morning (09:00 AM – 02:00 PM), Evening (06:00 PM – 11:00 PM), and Full Day (09:00 AM – 11:00 PM). Selecting a Full Day booking automatically locks out both Morning and Evening slots for that date across the system to prevent scheduling overlaps.',
    },
    {
      q: 'How does the double-booking collision guard protect my reservation?',
      a: 'Our booking engine uses atomic ACID database transactions with row-level locks. The moment you initiate checkout, your desired slot is reserved. If another client attempts to book the same slot simultaneously, the collision guard safely prevents double-charging and confirms the first submission.',
    },
    {
      q: 'Can I inspect or tour the hall before completing advance payment?',
      a: 'Absolutely! You can place a tentative booking hold online with the "Pay at Venue" option. Our venue managers are available daily from 09:00 AM to 08:00 PM for guided in-person walkthroughs of the bridal suites, sound systems, dining seating, and stage illumination.',
    },
    {
      q: 'What amenities are included in the hall booking tariff?',
      a: 'Every venue tariff includes central air conditioning, 100% generator power backup, stage lighting, wireless microphones, bridal dressing rooms, and guest valet parking. Custom decor, stage themes, and catering packages can be tailored with our in-house partners.',
    },
    {
      q: 'How can I check status or reschedule my booking?',
      a: 'You can check your reservation details anytime using the "Track My Booking" portal with your unique Reference Number (e.g., HALL-2026-XXXXX). Cancellations submitted at least 14 days before the event are eligible for full refunds or complimentary date transfers.',
    },
    {
      q: 'Which payment methods are accepted?',
      a: 'We accept all major Credit/Debit Cards, UPI, Net Banking, and Bank Transfers through encrypted gateways, as well as cash and card payments directly at the venue desk prior to the event.',
    },
  ];

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
            <span className="text-xs font-bold tracking-widest uppercase text-[#835D12] block mb-2">
              Signature Venues
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              Featured Banquet & Party Halls
            </h2>
          </div>
          <Link
            to="/halls"
            className="inline-flex items-center space-x-1 text-sm font-semibold text-[#835D12] hover:text-[#A17619] mt-4 md:mt-0 group"
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

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-[#835D12] block mb-2">
            Client Stories
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-900">
            Loved By Families & Event Organizers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FCFAF7]/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#E7CA70]/60 transition-all space-y-4">
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

          <div className="bg-[#FCFAF7]/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#E7CA70]/60 transition-all space-y-4">
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

          <div className="bg-[#FCFAF7]/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-[#E7CA70]/60 transition-all space-y-4">
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

      {/* How GrandVenues Booking Works (Moved to Bottom & Styled to match Beige Theme) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 bg-[#F9F0D3]/90 border border-[#E7CA70]/70 px-4 py-1.5 rounded-full text-[#835D12] text-xs font-semibold uppercase tracking-wider shadow-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#A17619]" />
            <span>Effortless 3-Step Process</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            How GrandVenues Booking Works
          </h2>
          <p className="text-slate-600 text-sm mt-3 leading-relaxed">
            Reserve your celebration venue smoothly without physical office visits or waiting in lines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white/85 hover:bg-white backdrop-blur-md border border-amber-900/10 hover:border-[#E7CA70]/70 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#835D12] to-[#C39626] text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
              01
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">Choose Hall & Date</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Explore hall capacities, photos, and amenities. Pick your desired event date to view live availability across Morning, Evening, or Full Day slots.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white/85 hover:bg-white backdrop-blur-md border border-amber-900/10 hover:border-[#E7CA70]/70 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#835D12] to-[#C39626] text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
              02
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">Instant Slot Hold</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Lock your desired time slot instantly. Our automated concurrency engine prevents double bookings and guarantees zero overlaps.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white/85 hover:bg-white backdrop-blur-md border border-amber-900/10 hover:border-[#E7CA70]/70 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#835D12] to-[#C39626] text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
              03
            </div>
            <h3 className="font-serif text-xl font-bold text-slate-900">Confirmation & Passes</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Receive booking reference receipts directly via email. Pay securely online or settle at the venue manager desk before the celebration.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section id="faq" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-[#F9F0D3]/90 border border-[#E7CA70]/70 px-4 py-1.5 rounded-full text-[#835D12] text-xs font-semibold uppercase tracking-wider shadow-sm mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#A17619]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-black text-sm mt-3 font-medium">
            Everything you need to know about slot reservations, policies, and hall amenities.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white/85 backdrop-blur-md border border-amber-900/10 rounded-2xl overflow-hidden transition-all shadow-sm hover:border-[#E7CA70]/60"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-slate-900 hover:text-[#835D12] transition-colors"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#835D12] transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-amber-900/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { GlowCard } from '@/components/ui/spotlight-card';
import { Sparkles, Crown, Gem, Users, Star, ArrowRight } from 'lucide-react';

export function Default() {
  const showcaseVenues = [
    {
      title: 'Grand Imperial Ballroom',
      category: 'Presidential Suite',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      capacity: '800 Guests',
      rating: '4.98',
      price: '₹1,50,000',
      icon: Crown,
      glowColor: 'amber' as const,
    },
    {
      title: 'Royal Heritage Pavilion',
      category: 'Palace Courtyard',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      capacity: '500 Guests',
      rating: '4.95',
      price: '₹1,20,000',
      icon: Gem,
      glowColor: 'amber' as const,
    },
    {
      title: 'Crystal Chandelier Hall',
      category: 'Signature Collection',
      image: 'https://images.unsplash.com/photo-1545232979-fbf68fe9f15b?auto=format&fit=crop&w=800&q=80',
      capacity: '350 Guests',
      rating: '4.92',
      price: '₹95,000',
      icon: Sparkles,
      glowColor: 'amber' as const,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background subtle radial spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[90vw] h-[50vh] rounded-full bg-white/[0.03] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] rounded-full bg-amber-500/[0.04] blur-[120px] pointer-events-none" />

      {/* Header Title */}
      <div className="relative z-10 text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-200 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#E7CA70]" />
          <span>Interactive Pointer Spotlight</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight">
          Featured Luxury Banquets
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
          Hover across the cards to experience pointer-tracking radiant illumination
        </p>
      </div>

      {/* 3 Interactive Spotlight Glow Cards */}
      <div className="relative z-10 flex flex-wrap flex-row items-center justify-center gap-8 custom-cursor max-w-6xl w-full">
        {showcaseVenues.map((venue, idx) => {
          const Icon = venue.icon;
          return (
            <GlowCard
              key={idx}
              glowColor={venue.glowColor}
              size="lg"
              className="bg-black border-white/10 hover:border-[#E7CA70]/60 group text-white shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            >
              {/* Card Media Header */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden mb-2">
                <img
                  src={venue.image}
                  alt={venue.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-medium text-amber-200">
                  <Icon className="w-3 h-3 text-[#E7CA70]" />
                  <span>{venue.category}</span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{venue.rating}</span>
                </div>
              </div>

              {/* Card Content & Details */}
              <div className="space-y-3">
                <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#E7CA70] transition-colors leading-snug">
                  {venue.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-neutral-400 pt-1 border-t border-white/10">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#E7CA70]" />
                    {venue.capacity}
                  </span>
                  <span className="font-semibold text-white text-sm">
                    {venue.price} <span className="text-[10px] text-neutral-500 font-normal">/ slot</span>
                  </span>
                </div>

                <button
                  type="button"
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#835D12] via-[#A17619] to-[#C39626] hover:brightness-110 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-md shadow-black/80 transition-all cursor-pointer"
                >
                  <span>Reserve Venue</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </GlowCard>
          );
        })}
      </div>
    </div>
  );
}

export default Default;

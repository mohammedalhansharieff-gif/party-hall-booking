import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Hall } from '../../types';
import { AmenitiesList } from './AmenitiesList';

interface HallCardProps {
  hall: Hall;
}

export const HallCard: React.FC<HallCardProps> = ({ hall }) => {
  const displayImage =
    hall.images?.[0] ||
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-[#FCFAF7] rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#E7CA70]/80 transition-all duration-300 overflow-hidden flex flex-col h-full hover:-translate-y-1">
      {/* Image with overlay tags */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={hall.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center space-x-1.5 border border-slate-200/60">
          <Users className="w-3.5 h-3.5 text-[#A17619]" />
          <span>Up to {hall.capacity.toLocaleString()} guests</span>
        </div>

        <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl shadow-md text-xs font-semibold border border-amber-500/20">
          From <span className="text-base font-bold text-amber-400">₹{hall.pricePerSlot.toLocaleString('en-IN')}</span> / slot
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#A17619] shrink-0" />
            <span className="truncate">{hall.location || 'Central City'}</span>
          </div>

          <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {hall.name}
          </h3>

          <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {hall.description || 'Premium venue equipped with modern banquet amenities and personalized event setups.'}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-200/60">
          <div className="mb-4">
            <AmenitiesList amenities={hall.amenities || []} limit={3} />
          </div>

          <Link
            to={`/halls/${hall.id}`}
            className="w-full inline-flex items-center justify-center space-x-2 bg-slate-900 text-white group-hover:bg-gradient-to-r group-hover:from-[#A17619] group-hover:via-[#B88924] group-hover:to-[#C39626] px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-sm"
          >
            <span>Check Availability & Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Search, Filter, Users, IndianRupee, RotateCcw } from 'lucide-react';
import { getHalls } from '../api/halls.api';
import { Hall } from '../types';
import { HallCard } from '../components/halls/HallCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Halls: React.FC = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000);

  const fetchHalls = async () => {
    try {
      setLoading(true);
      const data = await getHalls({
        search: search.trim() || undefined,
        minCapacity: minCapacity > 0 ? minCapacity : undefined,
        maxPrice: maxPrice < 100000 ? maxPrice : undefined,
      });
      setHalls(data);
    } catch (err) {
      console.error('Failed to load halls', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHalls();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, minCapacity, maxPrice]);

  const handleReset = () => {
    setSearch('');
    setMinCapacity(0);
    setMaxPrice(100000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Banquet & Wedding Halls
        </h1>
        <p className="text-sm text-slate-600">
          Discover handpicked venues curated for marriage ceremonies, receptions, family parties, and galas.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FCFAF7] p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by hall name or location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          {/* Min Capacity */}
          <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <Users className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Min Capacity</span>
                <span className="text-indigo-600">{minCapacity ? `${minCapacity}+ guests` : 'Any'}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={minCapacity}
                onChange={(e) => setMinCapacity(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Max Price */}
          <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <IndianRupee className="w-4 h-4 text-slate-500 shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Max Price / Slot</span>
                <span className="text-indigo-600">
                  {maxPrice < 100000 ? `₹${maxPrice.toLocaleString('en-IN')}` : 'Any Price'}
                </span>
              </div>
              <input
                type="range"
                min="20000"
                max="100000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {(search || minCapacity > 0 || maxPrice < 100000) && (
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={handleReset}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Halls Grid */}
      {loading ? (
        <LoadingSpinner message="Searching matching venues..." />
      ) : halls.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <p className="text-slate-700 font-semibold text-lg">No halls match your search criteria</p>
          <p className="text-slate-400 text-sm">
            Try adjusting your capacity slider, price limits, or search keywords.
          </p>
          <button
            onClick={handleReset}
            className="mt-3 px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-xl text-xs hover:bg-indigo-100"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {halls.map((hall) => (
            <HallCard key={hall.id} hall={hall} />
          ))}
        </div>
      )}
    </div>
  );
};

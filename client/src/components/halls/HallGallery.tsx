import React, { useState } from 'react';

interface HallGalleryProps {
  images: string[];
  hallName: string;
}

export const HallGallery: React.FC<HallGalleryProps> = ({ images, hallName }) => {
  const fallbackImage =
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80';
  const imgList = images?.length > 0 ? images : [fallbackImage];
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[16/9] md:aspect-[16/10] overflow-hidden rounded-2xl bg-slate-900 shadow-lg group">
        <img
          src={imgList[activeIdx] || fallbackImage}
          alt={`${hallName} view ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        <div className="absolute bottom-4 left-4 text-white text-xs font-semibold px-2.5 py-1 rounded bg-black/40 backdrop-blur-sm">
          Photo {activeIdx + 1} of {imgList.length}
        </div>
      </div>

      {/* Thumbnails */}
      {imgList.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
          {imgList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative shrink-0 w-20 h-16 md:w-24 md:h-18 rounded-lg overflow-hidden border-2 transition-all ${
                activeIdx === idx
                  ? 'border-indigo-600 ring-2 ring-indigo-300 scale-95'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

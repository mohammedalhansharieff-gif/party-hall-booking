import React from 'react';
import {
  Wind,
  Car,
  Utensils,
  Volume2,
  Sparkles,
  Zap,
  Shield,
  CheckCircle2,
} from 'lucide-react';

interface AmenitiesListProps {
  amenities: string[];
  limit?: number;
}

const getAmenityIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('ac') || lower.includes('air condition')) return <Wind className="w-3.5 h-3.5" />;
  if (lower.includes('parking') || lower.includes('valet')) return <Car className="w-3.5 h-3.5" />;
  if (lower.includes('kitchen') || lower.includes('buffet') || lower.includes('catering'))
    return <Utensils className="w-3.5 h-3.5" />;
  if (lower.includes('sound') || lower.includes('audio') || lower.includes('dj'))
    return <Volume2 className="w-3.5 h-3.5" />;
  if (lower.includes('light') || lower.includes('stage') || lower.includes('decor'))
    return <Sparkles className="w-3.5 h-3.5" />;
  if (lower.includes('generator') || lower.includes('backup')) return <Zap className="w-3.5 h-3.5" />;
  if (lower.includes('suite') || lower.includes('room')) return <Shield className="w-3.5 h-3.5" />;
  return <CheckCircle2 className="w-3.5 h-3.5" />;
};

export const AmenitiesList: React.FC<AmenitiesListProps> = ({ amenities, limit }) => {
  const displayed = limit ? amenities.slice(0, limit) : amenities;
  const remaining = limit && amenities.length > limit ? amenities.length - limit : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {displayed.map((item, idx) => (
        <span
          key={idx}
          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
        >
          <span className="text-indigo-600">{getAmenityIcon(item)}</span>
          <span>{item}</span>
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
          +{remaining} more
        </span>
      )}
    </div>
  );
};

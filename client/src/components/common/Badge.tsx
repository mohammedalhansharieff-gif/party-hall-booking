import React from 'react';

interface BadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'sm' }) => {
  const norm = status?.toUpperCase() || 'UNKNOWN';

  let colorClasses = 'bg-gray-100 text-gray-700 border-gray-200';

  switch (norm) {
    case 'AVAILABLE':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'CONFIRMED':
    case 'PAID':
      colorClasses = 'bg-green-50 text-green-700 border-green-200';
      break;
    case 'PENDING':
    case 'UNPAID':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'BOOKED':
    case 'CANCELLED':
    case 'CONFLICT':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'REFUNDED':
      colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
  }

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${colorClasses} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 currentColor bg-current opacity-70"></span>
      {norm}
    </span>
  );
};

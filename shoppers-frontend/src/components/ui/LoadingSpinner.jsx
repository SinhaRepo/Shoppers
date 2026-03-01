import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 24, className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <Loader2 size={size} className="animate-spin text-text-muted" />
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-border-card overflow-hidden">
    <div className="h-44 skeleton-shimmer" />
    <div className="p-3 space-y-2">
      <div className="h-3 skeleton-shimmer rounded w-3/4" />
      <div className="h-3 skeleton-shimmer rounded w-1/2" />
      <div className="h-4 skeleton-shimmer rounded w-2/3" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 10 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default LoadingSpinner;

import React from 'react';
import Skeleton from './Skeleton';

/**
 * A full-screen loading state component for the main dashboard.
 *
 * Composes multiple Skeleton components to mimic the layout of the app
 * while data is being fetched.
 *
 * @component
 * @returns {JSX.Element} The rendered LoadingState component.
 */
const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col space-y-8 px-6 pt-8 pb-36">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-32 h-6" />
          </div>
        </div>
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>

      {/* Credit Card Skeleton */}
      <Skeleton className="w-full h-64 rounded-3xl" />

      {/* Trial Banner Skeleton */}
      <Skeleton className="w-full h-24 rounded-2xl" />

      {/* Categories Skeleton */}
      <div className="space-y-3">
        <Skeleton className="w-32 h-5" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Studios Skeleton */}
      <div className="space-y-4">
        <Skeleton className="w-40 h-5" />
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-4 p-4 rounded-2xl bg-onyx-900 border border-white/5">
            <Skeleton className="w-24 h-28 rounded-lg" />
            <div className="flex-1 space-y-3 py-1">
              <Skeleton className="w-3/4 h-6" />
              <Skeleton className="w-1/2 h-4" />
              <div className="flex justify-between mt-4">
                 <Skeleton className="w-16 h-4" />
                 <Skeleton className="w-12 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
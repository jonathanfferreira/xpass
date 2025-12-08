import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div 
      className={`bg-onyx-800 animate-pulse rounded-lg relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-[shimmer_1.5s_infinite]" />
    </div>
  );
};

export default Skeleton;
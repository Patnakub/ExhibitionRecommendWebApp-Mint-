'use client';

import React from 'react';

const UpcomingEventsSkeleton: React.FC = () => {
  return (
    <section className="px-6 py-10 bg-white">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-40 bg-gray-300 rounded animate-pulse" />
        <div className="h-5 w-20 bg-gray-300 rounded animate-pulse" />
      </div>

      {/* Image Skeleton */}
      <div className="relative overflow-hidden rounded-xl shadow-md">
        <div className="w-full h-64 bg-gray-200 animate-pulse rounded-xl" />
      </div>

      {/* Dots Skeleton */}
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
        ))}
      </div>
    </section>
  );
};

export default UpcomingEventsSkeleton;

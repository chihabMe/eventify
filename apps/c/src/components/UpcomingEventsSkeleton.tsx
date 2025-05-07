import React from 'react';

const EventCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200 w-full"></div>

      {/* Content skeleton */}
      <div className="p-4">
        {/* Category badge skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>

        {/* Title skeleton - two lines */}
        <div className="h-5 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>

        {/* Date skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

        {/* Button skeleton */}
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  );
};

const EventsGridSkeleton: React.FC = () => {
  // Create an array of 8 elements for the skeleton cards
  const skeletonArray = Array(4).fill(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {skeletonArray.map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
};

export { EventsGridSkeleton, EventCardSkeleton };

import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="aspect-w-4 aspect-h-3 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

export const PlantDetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const MapSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg"></div>
  </div>
);

export const LoadingSkeleton = {
  Card: CardSkeleton,
  PlantDetail: PlantDetailSkeleton,
  Map: MapSkeleton
};

export default LoadingSkeleton;

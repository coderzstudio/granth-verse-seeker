
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const RelatedBookSkeleton: React.FC = () => {
  return (
    <div className="w-[200px] bg-white rounded-lg border border-orange-100 overflow-hidden">
      {/* Book Image Skeleton */}
      <Skeleton className="h-[120px] w-full" />

      {/* Book Info Skeleton */}
      <div className="p-3">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-3 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2 mb-2" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
};

export default RelatedBookSkeleton;

import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-white rounded-md overflow-hidden border border-taupe-200/60 animate-pulse">
      <div className="aspect-[3/4] w-full bg-taupe-200/50" />
      <div className="p-4 space-y-3">
        <div className="h-2.5 bg-taupe-200/60 rounded w-1/3" />
        <div className="h-4 bg-taupe-200/70 rounded w-3/4" />
        <div className="h-3.5 bg-taupe-200/60 rounded w-1/2" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

import React from "react";

export default function DashboardSkeleton() {
  return (
    <div className="p-8 animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-1/3 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/4 bg-gray-100 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded" />
        ))}
      </div>
      <div className="mb-8">
        <div className="h-6 w-1/6 bg-gray-200 rounded mb-4" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 w-full bg-gray-100 rounded" />
          ))}
        </div>
      </div>
      <div>
        <div className="h-6 w-1/6 bg-gray-200 rounded mb-4" />
        <div className="h-16 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

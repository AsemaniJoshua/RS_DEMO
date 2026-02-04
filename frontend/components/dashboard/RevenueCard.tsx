import React from 'react';

interface RevenueCardProps {
  revenue: number;
}

export default function RevenueCard({ revenue }: RevenueCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center">
      <span className="text-gray-500 text-sm">Ebook Revenue</span>
      <span className="text-2xl font-bold text-green-600 mt-2">${revenue.toLocaleString()}</span>
    </div>
  );
}

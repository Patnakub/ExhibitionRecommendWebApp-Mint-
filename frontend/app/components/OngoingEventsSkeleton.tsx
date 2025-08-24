import React from 'react';

const EventSkeleton: React.FC = () => {
  return (
    <div className="min-w-[200px] animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-t-full" />
      <div className="p-3 mt-2 bg-gray-200 rounded-xl h-16" />
    </div>
  );
};

const OngoingEventsSkeleton: React.FC = () => {
  return (
    <section className="px-6 py-8 bg-white font-sans">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Ongoing Events</h2>
        <div className="text-blue-300 font-medium">View all</div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {[1, 2, 3].map((id) => (
          <EventSkeleton key={id} />
        ))}
      </div>
    </section>
  );
};

export default OngoingEventsSkeleton;
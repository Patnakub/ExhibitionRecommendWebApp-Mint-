'use client';

import React from 'react';

interface Event {
  _id: string;
  title: string;
  location: string;
  cover_picture: string;
}

interface OngoingEventsProps {
  events: Event[];
}

const OngoingEvents: React.FC<OngoingEventsProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return <p className="text-center text-gray-400">No ongoing exhibitions found</p>;
  }

  return (
    <div className="scroll-grid px-4">
      {events.map((event) => (
        <a
          key={event._id}
          href={`/exhibition.html?id=${event._id}`}
          className="min-w-[200px] bg-white rounded-xl overflow-hidden shadow"
        >
          <img
            src={event.cover_picture}
            alt={event.title}
            className="w-full h-40 object-cover rounded-t-xl"
          />
          <div className="bg-[#5372A4] text-center p-3 flex flex-col justify-center text-white">
            <h3 className="text-sm font-semibold truncate" style={{ color: 'white' }}>
              {event.title}
            </h3>
            <p className="text-xs" style={{ color: 'white' }}>
              {event.location || '-'}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default OngoingEvents;
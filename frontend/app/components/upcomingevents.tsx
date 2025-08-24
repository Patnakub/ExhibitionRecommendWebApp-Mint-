'use client';

import React, { useEffect, useState } from 'react';

interface Event {
  _id: string;
  title: string;
  location: string;
  cover_picture: string;
}

const isImageLoadable = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
};

const UpcomingEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/exhibitions/upcoming`);
        const data = await res.json();

        const filtered = await Promise.all(
          data.map(async (event: Event) => {
            const imgUrl = event.cover_picture?.startsWith('http')
              ? event.cover_picture
              : `${process.env.NEXT_PUBLIC_API_BASE}${event.cover_picture}`;
            const canLoad = await isImageLoadable(imgUrl);
            return canLoad ? { ...event, cover_picture: imgUrl } : null;
          })
        );

        setEvents(filtered.filter(Boolean) as Event[]);
      } catch (err) {
        console.error('❌ Failed to fetch upcoming events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading upcoming events...</p>;
  if (events.length === 0) return <p className="text-center text-gray-400">No upcoming exhibitions found</p>;

  return (
    <div className="scroll-grid px-4">
      {events.map((event) => (
        <a
          href={`/exhibition.html?id=${event._id}`}
          key={event._id}
          className="min-w-[200px] bg-white rounded-xl overflow-hidden shadow"
          style={{ textDecoration: 'none' }}
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

export default UpcomingEvents;
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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

interface OngoingEventsProps {
  onViewAll?: () => void;
}

const OngoingEvents: React.FC<OngoingEventsProps> = ({ onViewAll }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/exhibitions/ongoing`);
        const data = await res.json();

        const filtered = await Promise.all(
          data.map(async (event: Event) => {
            if (!event.title || !event.cover_picture || !event.location) {
              return null;
            }

            const imgUrl = event.cover_picture.startsWith('http')
              ? event.cover_picture
              : `${process.env.NEXT_PUBLIC_API_BASE}${event.cover_picture}`;

            const canLoad = await isImageLoadable(imgUrl);
            return canLoad ? { ...event, cover_picture: imgUrl } : null;
          })
        );


        setEvents(filtered.filter(Boolean).slice(0, 5) as Event[]);
      } catch (err) {
        console.error('❌ Failed to fetch ongoing events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading ongoing events...</p>;
  if (events.length === 0) return <p className="text-center text-gray-400">No ongoing exhibitions found</p>;

  return (
    <section className="px-6 py-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Ongoing Events</h2>
        {onViewAll && (
          <button onClick={onViewAll} aria-label="View all ongoing events" className="text-blue-500 font-medium hover:underline">
          View all
          </button>
          )}
      </div>

      {/* Centered container */}
      <div className="flex justify-center">
        <div className="flex justify-between gap-4 w-full max-w-screen-xl mx-auto">
          {events.map((event) => (
            <Link
            key={event._id}
            href={`/event/${event._id}`}
            className="w-[18%] flex-shrink-0"
            >
              {/* Image */}
              <div className="bg-white rounded-t-full overflow-hidden shadow-xl w-full h-[250px] flex items-center justify-center">
                <img
                  src={event.cover_picture}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text box */}
              <div className="p-3 mt-2 text-center bg-[#5372A4] rounded-xl shadow-xl h-[100px] flex flex-col justify-center">
              <h3 className="text-sm font-semibold !text-white">
                {event.title}
              </h3>
              <p className="text-xs !text-white">
                {event.location || '-'}
              </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
};

export default OngoingEvents;
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

interface UpcomingEventsProps {
  onViewAll?: () => void;
}

const UpcomingEventsContainer: React.FC<UpcomingEventsProps> = ({ onViewAll }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/exhibitions?status=upcoming&page=1&limit=10`);

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
        console.error('❌ Failed to fetch upcoming events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 2000);

    // เคลียร์ Interval เมื่อ component ถูก unmount
    return () => clearInterval(interval);
  }, [events]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  if (loading) return <p className="text-center text-gray-400">Loading upcoming events...</p>;
  if (events.length === 0) return <p className="text-center text-gray-400">No upcoming exhibitions found</p>;

  return (
    <section className="px-6 py-10 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Upcoming Events</h2>
        {onViewAll && (
          <a onClick={onViewAll} className="cursor-pointer text-blue-500 font-medium hover:underline">
            View all
          </a>
        )}
      </div>

      <div className="relative overflow-hidden rounded-xl shadow-md">
        <div
          className="w-full h-120 flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {events.map((event) => (
            <div key={event._id} className="min-w-full relative">
              <Link href={`/event/${event._id}`}>
                <div className="cursor-pointer">
                  <img
                    src={event.cover_picture}
                    alt={event.title}
                    className="w-full h-120 object-cover"
                  />
                  <div className="absolute bottom-0 w-full bg-[#5372A4] bg-opacity-80 text-center p-3">
                    <h3
                      className="text-sm font-semibold truncate text-white"
                      style={{ color: 'white' }} 
                    >
                      {event.title}
                    </h3>
                    <p
                      className="text-xs text-white"
                      style={{ color: 'white' }} 
                    >
                      {event.location || '-'}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-40 px-2 py-1 rounded-full"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-40 px-2 py-1 rounded-full"
        >
          ▶
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {events.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default UpcomingEventsContainer;
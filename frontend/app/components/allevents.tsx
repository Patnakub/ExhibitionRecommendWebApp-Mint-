'use client';

import React, { useState, useEffect, forwardRef } from 'react';

const categories = [
  'Art & Design', 'Beauty & Fashion', 'Home & Furniture', 'Business',
  'Education', 'Concert', 'Technology', 'Book', 'Food & Drink', 'Others',
];

const tabs = ['Ongoing', 'Upcoming', 'Past'];

interface Event {
  _id: string;
  title: string;
  location: string;
  cover_picture: string;
  status: string;
  categories: string[];
}

interface AllEventsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const isImageLoadable = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
};

const AllEventsSection = forwardRef<HTMLDivElement, AllEventsProps>(function AllEventsSection(
  { selectedTab, setSelectedTab },
  ref
) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(selectedTab || 'Ongoing');
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const LIMIT = 10;

  useEffect(() => {
    setActiveTab(selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    setEvents([]);
    setPage(1);
    setHasMore(true);
    fetchEvents(1, true);
  }, [selectedCategory, activeTab]);

  const fetchEvents = async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      const status = activeTab.toLowerCase();
      const params = new URLSearchParams({
        status,
        page: pageNum.toString(),
        limit: LIMIT.toString(),
      });
      if (selectedCategory) params.append('category', selectedCategory);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/exhibitions?${params}`);
      const data = await res.json();

      const filtered = await Promise.all(
        data.map(async (event: Event) => {
          if (!event.title || !event.location || !event.cover_picture) return null;

          const isValid =
            event.cover_picture.startsWith('http') &&
            (await isImageLoadable(event.cover_picture));

          return isValid ? event : null;
        })
      );

      const validEvents = filtered.filter((e): e is Event => e !== null);


      if (Array.isArray(validEvents)) {
        setEvents((prev) => (reset ? validEvents : [...prev, ...validEvents]));
        setPage(pageNum + 1);
        if (validEvents.length < LIMIT) setHasMore(false);
      } else {
        console.error('Invalid data format', data);
      }
    } catch (err) {
      console.error('Failed to fetch exhibitions:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    fetchEvents(page);
  };

  return (
    <div ref={ref} className="scroll-grid px-4 py-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white">All Events</h2>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1 rounded-full drop-shadow-lg text-sm font-semibold ${
              activeTab === tab ? 'bg-red-300 text-white' : 'bg-[#FFBAA3] text-white'
            }`}
            onClick={() => {
              setActiveTab(tab);
              setSelectedTab(tab);
              setSelectedCategory(null);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
            className={`w-auto sm:w-1/4 lg:w-1/5 px-4 py-2 rounded-full text-sm ${
              cat === selectedCategory ? 'bg-[#5372A4] text-white' : 'bg-slate-400 text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events */}
      {loading && events.length === 0 ? (
        <p className="text-center text-white">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-center text-white">No exhibitions found</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {events.map((event) => (
              <a
              href={`/event/${event._id}`}
                key={event._id}
                className="flex flex-col"
                style={{ textDecoration: 'none' }}
              >
                {/* Image box */}
                <div className="bg-white rounded-t-full overflow-hidden shadow-xl w-full h-[250px] flex items-center justify-center">
                  <img
                    src={event.cover_picture}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Text box */}
                <div className="p-3 mt-2 text-center bg-[#5372A4] rounded-xl shadow-xl h-[100px] flex flex-col justify-center">
                  <h3 className="text-sm font-semibold !text-white">{event.title}</h3>
                  <p className="text-xs !text-white">{event.location || '-'}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="text-center mt-6">
              <button
                className="px-6 py-2 bg-[#5372A4] text-white rounded-full hover:bg-[#3f5c88] transition"
                onClick={loadMore}
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default AllEventsSection;

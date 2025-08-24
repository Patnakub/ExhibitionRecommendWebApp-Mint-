'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const BannerSlide: React.FC = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/exhibitions/ongoing`);
        const data = await res.json();

        const filtered = await Promise.all(
          data.map(async (item: any) => {
            if (!item.title || !item.cover_picture) return null;

            const imgUrl = item.cover_picture.startsWith('http')
              ? item.cover_picture
              : `${process.env.NEXT_PUBLIC_API_BASE}${item.cover_picture}`;

            const canLoad = await new Promise<boolean>((resolve) => {
              const img = new Image();
              img.src = imgUrl;
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false);
            });

            return canLoad ? {
              id: item._id,
              title: item.title,
              description: item.description || '',
              imageUrl: imgUrl,
            } : null;
          })
        );

        setBanners(filtered.filter(Boolean));
      } catch (err) {
        console.error('❌ Failed to fetch banners:', err);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [banners, isHovered]);

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {banners.map((banner, index) => (
        <img
          key={index}
          src={banner.imageUrl}
          alt={banner.title}
          className="absolute inset-0 object-cover w-full h-full transition-opacity duration-1000 ease-in-out"
          style={{ opacity: index === currentIndex ? 1 : 0 }}
        />
      ))}

      <Link
        href={`/event/${banners[currentIndex].id}`}
        className="absolute inset-0 z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="block w-full h-full" />
      </Link>

      <div className="absolute left-80 top-10 h-full w-full md:w-1/3 lg:w-1/4 bg-[rgba(83,114,164,0.5)] flex flex-col justify-start items-center px-6 py-10 text-white transform -translate-x-1/2 z-20">
        <img
          src="/logo.svg"
          alt="Logo"
          style={{
            height: '90px',
            maxWidth: '200px',
            width: '100%',
            filter: 'invert(1)',
            objectFit: 'contain',
          }}
        />
        <button
          className="bg-[#FFBAA3] text-white px-6 py-3 rounded-full shadow hover:bg-red-300 transition mt-4 w-full sm:w-auto"
          onClick={() => {
            const section = document.getElementById('recommend');
            if (section) {
              section.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          Find your inspiration !
        </button>
        <p
          className="text-center mt-6 max-w-md px-4 sm:px-0"
          style={{ color: 'white', zIndex: 10, position: 'relative' }}
        >
          "Your gateway to discovering exhibitions and activities that inspire and elevate your experience. Find, plan, and explore with us!"
        </p>
      </div>

      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl z-30"
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
      >
        ‹
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl z-30"
        onClick={() => setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1))}
      >
        ›
      </button>
    </section>
  );
};

export default BannerSlide;

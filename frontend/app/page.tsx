'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadOngoingImages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/exhibitions/ongoing`);
        const data = await response.json();
        const coverUrls = data
          .map((item: any) => item.cover_picture)
          .filter((url: string) => url && url.startsWith("http"));
        setImages(coverUrls);
      } catch (err) {
        console.error("🔥 ดึงข้อมูลผิดพลาด:", err);
      }
    };

    loadOngoingImages();
  }, []);

  useEffect(() => {
    const slideshowInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(slideshowInterval);
  }, [images]);

  return (
    <div>
      <div className="slideshow" style={{ position: 'fixed', width: '100%', height: '100%', zIndex: 0, overflow: 'hidden', top: 0, left: 0 }}>
        {images.map((url, index) => (
          <img
            key={index}
            src={url}
            alt="slide"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: index === currentIndex ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
            }}
          />
        ))}
      </div>

      <div className="fixed bottom-0 min-w-screen z-10 bg-gradient-to-b  to-[#5372A4] px-5 py-20 flex flex-col items-center">
      <button className="mt-5 px-6 py-2 rounded-xl drop-shadow-xl font-bold bg-[#FFBAA3] text-white hover:bg-red-300 transition-all"
      onClick={() => router.push('/home')}>CLICK TO ENTER</button>

  <div className="flex space-x-4 mt-4">
    <button
      className="px-6 py-2 rounded-xl drop-shadow-xl text-sm font-bold bg-[#9EBAC8] text-white hover:bg-slate-400 transition-all"
      onClick={() => router.push('/login')}
    >
      LOG IN
    </button>
    <button
      className="px-6 py-2 rounded-xl drop-shadow-xl text-sm font-bold bg-[#9EBAC8] text-white hover:bg-slate-400 transition-all"
      onClick={() => router.push('/register')}
    >
      REGISTER
    </button>
  </div>
</div>


    </div>
  );
};

export default Page;

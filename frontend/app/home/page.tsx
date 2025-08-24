'use client';

import React, { useState, useRef, useEffect } from 'react';
import InspiraNavbar from '../components/button';
import dynamic from 'next/dynamic';
import OngoingEventsContainer from '../components/ongoingEventsContainer';
import UpcomingEventsContainer from '../components/upcomingEventsContainer';
import AllEvents from '../components/allevents';
import RecommendationsSection from '../components/recommended';


  const BannerSlider = dynamic(() => import('../components/Bannerslide'), {
    ssr: false, 
  });

const HomePage = () => {
  const [selectedTab, setSelectedTab] = useState('Ongoing');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // เช็คว่าผู้ใช้ล็อกอินหรือไม่
  const allEventsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ตรวจสอบสถานะการล็อกอิน เช่นจาก cookie / session / token
    const checkLogin = async () => {
      const token = localStorage.getItem('token');
      console.log("📦 token:", token);

      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/session`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setIsLoggedIn(data?.isLoggedIn);
      } catch (error) {
        console.error('Failed to check login status');
      }
    };

    checkLogin();
  }, []);

  const handleViewAll = (tab: string) => {
    setSelectedTab(tab);
    allEventsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main>
      <InspiraNavbar />
      <BannerSlider />
      <RecommendationsSection isLoggedIn={isLoggedIn} />
      <OngoingEventsContainer onViewAll={() => handleViewAll('Ongoing')} />
      <UpcomingEventsContainer onViewAll={() => handleViewAll('Upcoming')} />
      <AllEvents
        ref={allEventsRef}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </main>
  );
};

export default HomePage;

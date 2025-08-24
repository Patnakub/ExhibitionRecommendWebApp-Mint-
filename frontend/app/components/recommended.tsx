'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Recommendation {
  _id: string;
  cover_picture: string;
  title: string;
  location: string;
}

interface Props {
  isLoggedIn: boolean;
}

const RecommendationsSection: React.FC<Props> = ({ isLoggedIn }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchRecommendations = async () => {
        try {
          const userStr = localStorage.getItem('user');
          const token = localStorage.getItem('token');
          if (!userStr || !token) return;

          const user = JSON.parse(userStr);
          const userId = user.id;

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/recommendations/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) throw new Error('Failed to fetch');
          const data = await res.json();
          setRecommendations(data);
        } catch (error) {
          console.error('❌ Failed to fetch recommendations:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchRecommendations();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn || loading || recommendations.length === 0) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <section
      id="recommend"
      className="relative z-30 -mt-9 bg-gradient-to-b from-[#e3ebf6] to-white py-12"
    >
      <div className="relative w-fit mx-auto">
        <h2
          className="absolute -top-5 -left-8 text-[64px] drop-shadow-xl z-20"
          style={{ fontFamily: 'var(--font-playball)', transform: 'rotate(-5deg)', color: '#5372A4' }}
        >
          Recommended
        </h2>

        <Slider {...settings} className="w-[640px]">
          {recommendations.map((rec) => (
            <Link href={`/event/${rec._id}`} key={rec._id}>
              <div className="relative z-10 block shadow-xl border-4 border-white rounded-md overflow-hidden cursor-pointer">
                {rec.cover_picture && (
                  <img
                    src={
                      rec.cover_picture.startsWith('http')
                        ? rec.cover_picture
                        : `${process.env.NEXT_PUBLIC_API_BASE}${rec.cover_picture}`
                    }
                    alt={rec.title}
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            </Link>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default RecommendationsSection;
""

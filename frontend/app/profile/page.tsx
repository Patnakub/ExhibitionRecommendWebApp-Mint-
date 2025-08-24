'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InspiraNavbar from '../components/button';
import ReviewTicket from "../components/reviewtickets";
import Image from 'next/image';
import Link from 'next/link';

interface Exhibition {
  _id: string;
  title: string;
  location: string;
  start_date?: string;
  end_date?: string;
  event_slot_time?: string;
  description?: string;
  cover_picture?: string;
}

interface Favorite {
  _id: string;
  exhibition_id: Exhibition;
}

interface User {
  _id: string;
  username: string;
}

interface Review {
  _id: string;
  exhibition_id: Exhibition;
  image_url?: string;
  rating: number;
  review: string;
  user_id?: User;
}

const API = process.env.NEXT_PUBLIC_API_BASE!; 

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setIsAuthenticated(true);

    // Fetch favorites + reviews
    (async () => {
      try {
        const [favRes, revRes] = await Promise.all([
          fetch(`${API}/favorites`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API}/reviews/me/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const [favData, revData] = await Promise.all([
          favRes.json(),
          revRes.json(),
        ]);
        setFavorites(favData);
        setReviews(revData);
      } catch (err) {
        console.error("⚠ โหลดข้อมูลล้มเหลว:", err);
      }
    })();
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative">
      {/* Background */}
      <Image
        src="/bglogin.svg"
        alt="Background"
        width={1440}
        height={200}
        className="absolute bottom-0 z-20 min-w-screen object-fill object-bottom"
      />

      <div className="bg-white min-h-screen px-6 py-8 pb-32 w-full relative z-10">
        <InspiraNavbar />

        <div className="max-w-6xl mx-auto py-10 px-6">
          {/* Favorites Section */}
          <h1
            className="text-4xl font-medium mb-6"
            style={{ fontFamily: "var(--font-playball)", color: "#5372A4" }}
          >
            MY FAVORITE EXHIBITIONS
          </h1>
          <div className="px-10 overflow-x-auto">
            <ul className="flex gap-8 min-w-max">
              {!favorites || favorites.length === 0 ? (
                <li className="text-gray-500">ยังไม่มีรายการโปรด</li>
              ) : (
                Array.isArray(favorites) && favorites.map((fav) => {
                  const imgPath = fav.exhibition_id.cover_picture || "";
                  const src = imgPath.startsWith("http")
                    ? imgPath
                    : `${API}${imgPath}`;
                  const id = fav.exhibition_id._id;

                  return (
                    <li key={fav._id}>
                      <Link href={`/event/${id}`}>
                        <div className="relative w-[180px] h-[350px] rounded-xl overflow-hidden shadow-2xl cursor-pointer transition-transform duration-300 origin-bottom hover:scale-[1.1]">
                          <img
                            src={src}
                            alt={fav.exhibition_id.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback image if API image fails to load
                              (e.target as HTMLImageElement).src = '/placeholder-exhibition.jpg';
                            }}
                          />
                        </div>
                      </Link>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          {/* Reviews Section */}
          <h1 
            className="text-4xl font-medium my-6"
            style={{ fontFamily: "var(--font-playball)", color: "#5372A4" }}
          >
            MY REVIEW
          </h1>
          {reviews.length === 0 ? (
            <p className="text-gray-500">ยังไม่มีรีวิว</p>
          ) : (
            <div className="px-10">
              {reviews.map((rev) => {
                const imgSrc = rev.image_url ? (
                  rev.image_url.startsWith("http") 
                    ? rev.image_url 
                    : `${API}${rev.image_url}`
                ) : (
                  rev.exhibition_id.cover_picture?.startsWith("http") 
                    ? rev.exhibition_id.cover_picture 
                    : `${API}${rev.exhibition_id.cover_picture || ""}`
                );
                const id = rev.exhibition_id._id;

                return (
                  <div key={rev._id} className="mb-8 w-full">
                    <Link href={`/event/${id}`}>
                      <div className="cursor-pointer z-10 w-full">
                        <ReviewTicket 
                          imageUrl={imgSrc}
                          title={rev.exhibition_id.title}
                          location={rev.exhibition_id.location}
                          datetime={rev.exhibition_id.start_date || "-"}
                          rating={`${rev.rating}/5`}
                          reviewText={rev.review || ""}
                        />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Review = {
  _id: string;
  rating: number;
  review: string;
  image_url?: string;
  user_id: {
    _id?: string;
    username?: string;
  } | string;
};

export default function AllReviewsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/reviews/${slug}`);
        if (!res.ok) throw new Error('ไม่พบรีวิว');
        const data = await res.json();

        const token = localStorage.getItem("token");
        const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

        const userReview = Array.isArray(data)
          ? data.find((r: Review) => {
              if (!r || !r.user_id) return false;
              return (typeof r.user_id === 'object' ? r.user_id._id : r.user_id) === userId;
            })
          : null;

        const otherReviews = Array.isArray(data)
          ? data.filter((r: Review) => {
              if (!r || !r.user_id) return false;
              return (typeof r.user_id === 'object' ? r.user_id._id : r.user_id) !== userId;
            })
          : [];


        const combined = userReview ? [userReview, ...otherReviews] : otherReviews;

        setReviews(combined);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [slug]);

  const renderStars = (rating: number) =>
    '★'.repeat(rating) + '☆'.repeat(5 - rating);

  if (loading) return <div className="text-center mt-20">กำลังโหลดรีวิว...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">โหลดรีวิวล้มเหลว</div>;

  return (
    <main className="px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-[#5b78a4] mb-6">รีวิวทั้งหมดของนิทรรศการ</h1>
      <hr className="mb-6" />

      {reviews.map((r) => {
        if (!r || !r.user_id) return null;

        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        const userId = token ? JSON.parse(atob(token.split('.')[1]))?.id : null;

        const reviewOwnerId =
          typeof r.user_id === 'object'
            ? r.user_id?._id ?? ''
            : r.user_id ?? '';

        const username =
          typeof r.user_id === 'object'
            ? r.user_id?.username ?? 'ผู้ใช้งาน'
            : 'ผู้ใช้งาน';

        const isOwnReview = userId === reviewOwnerId;

        if (!reviewOwnerId) return null;

        return (
          <div key={r._id} className="mb-6 border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="text-yellow-500 text-lg">{renderStars(r.rating)}</div>
              {isOwnReview && (
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => router.push(`/review/${slug}`)}
                >
                  แก้ไข
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600">โดย {username}</p>
            <p className="mt-2">{r.review}</p>
            {r.image_url && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE}${r.image_url}`}
                alt="รูปรีวิว"
                className="mt-2 max-h-48 rounded"
              />
            )}
          </div>
        );
      })}
    </main>
  );
}

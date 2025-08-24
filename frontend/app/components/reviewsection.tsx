'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Review {
  _id: string;
  rating: number;
  review: string;
  image_url?: string;
  user_id: {
    _id?: string;
    username?: string;
  } | string | null;
}

interface ReviewSectionProps {
  allReviews: Review[];
  exhibitionId: string;
  userId?: string | null; // รับจากไฟล์หลัก
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ allReviews, exhibitionId, userId: propUserId }) => {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  // ใช้ userId จาก props ถ้ามี, ไม่งั้นดึงจาก localStorage
  useEffect(() => {
    if (propUserId !== undefined) {
      setUserId(propUserId);
    } else if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      const id = token ? JSON.parse(atob(token.split('.')[1]))?.id : null;
      setUserId(id);
    }
  }, [propUserId]);

  if (userId === undefined) return null;

  const renderStars = (rating: number) =>
    '★'.repeat(rating) + '☆'.repeat(5 - rating);

  // คำนวณคะแนนเฉลี่ย
  const avgRating = allReviews.length > 0 
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : '0.0';

  const userReview = userId
    ? allReviews.find((r) => {
        const uid = typeof r.user_id === 'object' ? r.user_id?._id : r.user_id;
        return uid === userId;
      })
    : null;

  const others = userId
    ? allReviews.filter((r) => {
        const uid = typeof r.user_id === 'object' ? r.user_id?._id : r.user_id;
        return uid !== userId;
      }).reverse()
    : [...allReviews].reverse();

  // แสดงแค่ 2 รีวิวแรกในหน้าหลัก
  const displayReviews = others.slice(0, 2);
  const hasMoreReviews = others.length > 2;

  return (
    <div className="mt-8">
      {/* ส่วนหัว Reviews พร้อมคะแนน */}
      <h1 className="text-xl !text-[#5b78a4] flex items-center justify-center font-semibold mb-4 gap-2">
        Reviews
        <span className="flex items-center !text-[#5b78a4] text-xl">
          {'★'.repeat(Math.floor(Number(avgRating)))}
          {'☆'.repeat(5 - Math.floor(Number(avgRating)))} 
          <span className="ml-2 !text-[#5b78a4] text-xl">({avgRating} / 5)</span>
        </span>
      </h1>

      {/* รีวิวของผู้ใช้ปัจจุบัน */}
      {userReview && (
        <div className="mb-6 bg-gray-100 p-4 rounded shadow">
          <div className="flex items-center justify-between">
            <strong>รีวิวของคุณ</strong>
            <Link
              href={`/review/${exhibitionId}`}
              className="text-sm text-blue-600 hover:underline ml-2"
            >
              แก้ไข
            </Link>
          </div>
          <div className="text-yellow-500 text-lg">{renderStars(userReview.rating)}</div>
          <p className="text-sm mt-2">{userReview.review}</p>
          {userReview.image_url && (
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE ?? ''}${userReview.image_url}`}
              alt="รูปรีวิว"
              className="mt-2 rounded max-h-48"
            />
          )}
        </div>
      )}

      {/* รีวิวจากผู้ใช้อื่นในรูปแบบการ์ด */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayReviews.length === 0 && !userReview && (
            <p className="col-span-2 text-center text-gray-500">ยังไม่มีรีวิว</p>
          )}
          
          {displayReviews.length === 0 && userReview && (
            <p className="col-span-2 text-center text-gray-500">ยังไม่มีรีวิวอื่นๆ</p>
          )}

          {displayReviews.map((r) => {
            const username =
              typeof r.user_id === 'object' && r.user_id
                ? r.user_id.username || 'ผู้ใช้งาน'
                : 'ผู้ใช้งาน';

            return (
              <div
                key={r._id}
                className="relative rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.05] hover:shadow-[0_0_15px_rgba(91,120,164,0.8)]"
              >
                {r.image_url ? (
                  <div
                    className="relative h-60 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${r.image_url.startsWith('http') 
                        ? r.image_url 
                        : `${process.env.NEXT_PUBLIC_API_BASE ?? ''}${r.image_url}`})` 
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 text-white z-10">
                      <div className="font-semibold">{username}</div>
                      <div className="text-yellow-400">{renderStars(r.rating)} ({r.rating}/5)</div>
                      <p className="text-sm mt-2 line-clamp-3">{r.review}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-[#d0e6f7] to-[#ffd1dc] p-4 rounded-xl h-60 flex flex-col justify-between">
                    <div>
                      <div className="font-semibold text-[#5b78a4]">{username}</div>
                      <div className="text-yellow-500">{renderStars(r.rating)} ({r.rating}/5)</div>
                      <p className="text-sm mt-2 text-gray-700 line-clamp-4">{r.review}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ปุ่ม View More */}
        {(hasMoreReviews || others.length > 0) && (
          <div className="mt-4 text-right">
            <Link 
              href={`/event/${exhibitionId}/reviews`}
              className="text-sm text-black hover:underline"
            >
              View More&gt;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
'use client';

import React from "react";

type Props = {
  imageUrl: string;
  title: string;
  location: string;
  datetime: string;
  rating: string;
  reviewText?: string;
};

const API = process.env.NEXT_PUBLIC_API_BASE!;  

const ReviewTicket: React.FC<Props> = ({
  imageUrl,
  title,
  location,
  datetime,
  rating,
  reviewText
}) => {
  // ถ้า imageUrl ไม่ขึ้นต้นด้วย http ให้ต่อ API host ข้างหน้า
  const src = imageUrl.startsWith('http')
    ? imageUrl
    : `${API}${imageUrl}`;

  return (
    <div
      className="relative w-full max-w-4xl h-[300px] bg-no-repeat bg-cover bg-center text-[#3c5a99] z-10"
      style={{
        backgroundImage: 'url("/reviewticket.svg")',
      }}
    >
      {/* รูปรีวิวด้านซ้าย - ใช้ขนาดและตำแหน่งแบบเดียวกับไฟล์เก่า */}
      <div className="absolute left-15 top-0 w-1/3 h-[300px] rounded-xl overflow-hidden shadow-lg z-10">
        <img
          src={src}
          alt="Review Image"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            // Fallback image if loading fails
            (e.target as HTMLImageElement).src = '/placeholder-exhibition.jpg';
          }}
        />
      </div>

      {/* ข้อมูลรีวิวด้านขวา */}
      <div className="absolute right-6 top-0 w-[50%] flex flex-col justify-between h-[90%] p-4 overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold mb-2 line-clamp-2">{title}</h2>
          <p className="text-sm mb-1">
            📍 <span className="font-semibold">Location:</span> {location}
          </p>
          <p className="text-sm mb-4">
            📅 <span className="font-semibold">Date & Time:</span> {datetime}
          </p>
        </div>
        <div>
          <p className="font-bold text-lg mb-2">Review</p>
          <p className="text-xl mb-4">
            ★★★★★ <span className="text-sm">({rating})</span>
          </p>
          {reviewText && (
            <p className="text-base leading-relaxed whitespace-pre-wrap line-clamp-4">{reviewText}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewTicket;
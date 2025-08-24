'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('กำลังยืนยันอีเมล...');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setMessage('ไม่พบ token สำหรับยืนยันอีเมล');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message || 'ยืนยันอีเมลเรียบร้อยแล้ว!');
        setIsVerified(true);
      })
      .catch(() => {
        setMessage('เกิดข้อผิดพลาดในการยืนยันอีเมล');
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-blue-200">
      <div className="bg-white shadow-xl p-6 rounded-xl text-center max-w-md w-full">
        <h1 className="text-xl font-semibold text-[#5372A4] mb-4">Email Verification</h1>
        <p className="text-gray-700">{message}</p>

        {isVerified && (
          <button
            onClick={() => router.push('/login')}
            className="mt-6 px-6 py-2 bg-[#5372A4] text-white rounded-full hover:bg-[#415a8a] transition"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}

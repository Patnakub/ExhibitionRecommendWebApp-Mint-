'use client';

import React, { useState } from "react";
import Image from 'next/image';

const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword)
      return setError("กรุณากรอกรหัสผ่านทั้ง 3 ช่อง");

    if (newPassword !== confirmPassword)
      return setError("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน");

    try {
      const token = localStorage.getItem('token');
      if (!token) return setError("กรุณาเข้าสู่ระบบใหม่อีกครั้ง");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("🎉 รหัสผ่านของคุณได้รับการเปลี่ยนเรียบร้อยแล้ว!");
        setError("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
        setMessage("");
      }
    } catch {
      setError("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative pb-24">
      {/* ✅ Background image ที่ไม่บังปุ่ม */}
      <Image
        src="/bglogin.svg"
        alt="Background"
        width={1440}
        height={200}
        className="absolute bottom-0 z-0 w-full object-fill object-bottom pointer-events-none"
      />

      <h1 className="text-2xl font-semibold mb-4 text-[#5b78a4] z-10">Change password</h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md z-10">
        <label className="text-sm text-gray-700 mb-1">Old Password</label>
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#5b78a4]"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <label className="text-sm text-gray-700 mb-1">New Password</label>
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#5b78a4]"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label className="text-sm text-gray-700 mb-1">Confirm New Password</label>
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#5b78a4]"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleChangePassword}
          className="w-full bg-[#5b78a4] text-white py-2 rounded-full hover:bg-[#4a6795] transition"
        >
          Change Password
        </button>

        {message && <p className="text-green-600 text-sm mt-4">{message}</p>}
        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ChangePassword;

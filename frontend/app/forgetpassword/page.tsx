"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pinSent, setPinSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const pinRef = useRef<HTMLFormElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pinSent && pinRef.current) {
      pinRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [pinSent]);

  useEffect(() => {
    if (verified && passwordRef.current) {
      passwordRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [verified]);

  const sendPIN = async () => {
    if (!email) return setError("กรุณากรอกอีเมล");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/request-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setPinSent(true);
        setError("");
        setMessage("📩 ส่ง PIN ไปยังอีเมลเรียบร้อยแล้ว");
      } else {
        setError(data.message || "เกิดข้อผิดพลาดในการส่ง PIN");
      }
    } catch {
      setError("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  const confirmPIN = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || !email) return setError("กรุณากรอกอีเมลและ PIN");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/confirm-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pin, newPassword: "__dummy__" }),
      });

      const data = await res.json();
      if (res.ok && data.verified) {
        setVerified(true);
        setMessage("✅ PIN ถูกต้อง กรุณาตั้งรหัสผ่านใหม่");
        setError("");
      } else {
        setError(data.message || "PIN ไม่ถูกต้อง");
      }
    } catch {
      setError("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return setError("กรุณากรอกรหัสผ่านทั้ง 2 ช่อง");
    if (newPassword !== confirmPassword)
      return setError("รหัสผ่านไม่ตรงกัน");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/confirm-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pin, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("🎉 เปลี่ยนรหัสผ่านสำเร็จแล้ว! กรุณาเข้าสู่ระบบ");
        setVerified(false);
      } else {
        setError(data.message || data.error);
      }
    } catch {
      setError("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="relative">
      {/* 🌈 Background */}
      <Image
        src="/bglogin.svg"
        alt="Background"
        width={1440}
        height={200}
        className="absolute bottom-0 inset-x-0 z-0 w-full object-cover"
      />

      {/* 📄 Main content */}
      <div
        className={`flex flex-col items-center p-6 relative z-10 transition-all duration-500 ${
          !pinSent && !verified
            ? "min-h-screen justify-center"
            : "h-screen justify-start overflow-y-auto"
        }`}
      >
        <h2 className="text-2xl font-semibold text-[#5b78a4] mb-4 z-10">
          Forget password
        </h2>

        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md z-10 transition-all duration-500 space-y-6">
          {/* Email input */}
          <div>
            <label className="text-sm text-gray-700 mb-1">Enter your email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#5b78a4]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={sendPIN}
              className="mt-4 w-full bg-[#5b78a4] text-white py-2 rounded-lg hover:bg-[#4a6795] transition"
            >
              Send PIN
            </button>
          </div>

          {/* PIN form */}
          {pinSent && (
            <form ref={pinRef} onSubmit={confirmPIN}>
              <label className="text-sm text-gray-700 mb-1">Enter PIN</label>
              <input
                type="text"
                maxLength={6}
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#5b78a4]"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <button
                type="submit"
                className="mt-4 w-full bg-[#5b78a4] text-white py-2 rounded-lg hover:bg-[#4a6795] transition"
              >
                Confirm PIN
              </button>
            </form>
          )}

          {/* New password */}
          {verified && (
            <div ref={passwordRef}>
              <label className="text-sm text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#5b78a4]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label className="text-sm text-gray-700 mt-4 mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-[#5b78a4]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                onClick={resetPassword}
                className="mt-4 w-full bg-[#5b78a4] text-white py-2 rounded-lg hover:bg-[#4a6795] transition"
              >
                Change Password
              </button>
            </div>
          )}

          {/* Feedback */}
          {(message || error) && (
            <div className="pt-2">
              {message && <p className="text-green-600 text-sm">{message}</p>}
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

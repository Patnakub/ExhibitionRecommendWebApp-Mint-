'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react'; // 👁️ ไอคอนตา

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError('⚠️ โปรดกรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, {
        username: username.trim(),
        password: password.trim(),
      });

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setError('');
      setUsername('');
      setPassword('');
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/home');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
      setError(`❌ ${msg}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 relative bg-gray-50">
      <Image
        src="/bglogin.svg"
        alt="Background"
        width={1440}
        height={200}
        className="absolute bottom-0 z-0 min-w-screen object-fill object-bottom"
      />
      <h1 className="text-3xl font-bold mb-6 z-10 text-[#2D3E50]">Login</h1>
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center z-10">
        <p className="text-gray-600 mb-6 text-base">Welcome back! Please login to your account.</p>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white"
            />
          </div>

          <div className="text-left relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-10 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[38px] right-3 text-gray-500 hover:text-gray-800"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <p>
              New User?{' '}
              <Link href="/register" className="text-blue-500 hover:underline">
                Signup
              </Link>
            </p>
            <p>
              <Link href="/forgetpassword" className="text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </p>
          </div>

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <button
            type="submit"
            className="w-full mt-2 bg-[#5372A4] hover:bg-[#3d5987] text-white py-2 rounded-full text-base font-semibold transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

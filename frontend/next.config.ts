// next.config.js
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  env: {
    // ถ้าไม่มีตัวแปรสภาพแวดล้อมจริง ก็ใช้ localhost:5000
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  },
  // (ไม่ต้องใช้ rewrites ในวิธีนี้)
};

export default nextConfig;

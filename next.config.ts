import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // เปิดจากมือถือหรือ 127.0.0.1 ได้ ไม่งั้นสคริปต์ถูกบล็อก ปุ่มกดไม่ติด
  allowedDevOrigins: ["127.0.0.1", "192.168.*.*"],
};

export default nextConfig;

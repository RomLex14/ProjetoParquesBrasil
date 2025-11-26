import withPWAInit from "next-pwa";

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: process.env.NODE_ENV === "production", 
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", 
  register: true,
  skipWaiting: true,
});

const nextConfig = withPWA(baseConfig);

export default nextConfig;

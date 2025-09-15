// next.config.mjs

import withPWAInit from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... suas outras configurações do next.config.mjs
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
  disable: process.env.NODE_ENV === "development", // Desativa o PWA em modo de desenvolvimento
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);
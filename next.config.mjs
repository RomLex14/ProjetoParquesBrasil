/** @type {import('next').NextConfig} */
const nextConfig = {
  // env: {
  //   // Removido se NEXT_PUBLIC_API_URL era apenas para o backend Python
  // },
  // async rewrites() { // Removido se os rewrites eram apenas para o backend Python
  //   return []
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
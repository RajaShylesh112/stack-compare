/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'vercel.app', 'vercel.com'],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
          : 'http://localhost:4000/api/:path*',
      },
    ];
  },
  serverExternalPackages: ['@tanstack/react-query'],
  experimental: {
    optimizeCss: false, // Disable CSS optimization to prevent critters dependency issues
  },
  compiler: {
    removeConsole: false,
  },
  output: 'standalone',
  // Skip static generation for problematic routes
  async generateBuildId() {
    return 'build-' + Date.now();
  },
};

export default nextConfig;
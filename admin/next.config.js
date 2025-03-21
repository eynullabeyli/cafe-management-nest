/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['react-icons'],
  
  // Simple configuration for development in Replit
  // This config is focused on making the cross-origin request work
  
  // Proxy API requests to the NestJS server
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5000/api/:path*',
      },
    ];
  },
  
  // Set CORS headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  
  // Performance optimizations for Replit
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  
  // The critical configuration for cross-origin access in Replit
  experimental: {
    allowedDevOrigins: ["*"],
  },
  
  // Optimize image loading
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['react-icons'],
  
  // Simplified configuration for Replit
  
  // Proxy API requests to the NestJS server 
  async rewrites() {
    // Use localhost which is more reliable in Replit
    // const nestJsHost = 'http://localhost:5005';
    const nestJsHost = process.env.NEXT_PUBLIC_API_URL;
    console.log('Using NestJS host:', nestJsHost);
      
    return [
      {
        source: '/api/:path*',
        destination: `${nestJsHost}/api/:path*`,
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
  
  // Performance optimizations
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  
  // The wildcard approach for cross-origin access in Replit
  experimental: {
    allowedDevOrigins: ['*'],
  },
  
  // Optimize image loading
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
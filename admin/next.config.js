/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['react-icons'],
  
  // Simple configuration for development in Replit
  // This config is focused on making the cross-origin request work
  
  // Proxy API requests to the NestJS server 
  async rewrites() {
    // Always use the internal Replit IP address since we're in Replit
    const nestJsHost = 'http://172.31.128.44:5000';
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
  
  // Performance optimizations for Replit
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  
  // The critical configuration for cross-origin access in Replit
  experimental: {
    // We need to explicitly specify the full Replit origin including the subdomain
    allowedDevOrigins: [
      "https://f983daf1-bd62-47b0-b629-26314f3bcb7a-00-s70cy84odon4.picard.replit.dev", 
      "*.repl.dev", 
      "https://*.replit.dev", 
      "*.replit.app", 
      "https://*.replit.app"
    ],
  },
  
  // Optimize image loading
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
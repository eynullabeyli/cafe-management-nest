/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable strict CORS in development mode
  transpilePackages: ['react-icons'],
  
  // Proxy API requests to the NestJS server
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },

  // Set header to allow all origins
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
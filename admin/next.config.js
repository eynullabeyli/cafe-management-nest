/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow requests from Replit dev environment
  allowedDevOrigins: [
    process.env.REPL_SLUG ? new URL(`https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`).origin : null,
    process.env.REPL_SLUG ? new URL(`https://${process.env.REPL_ID}-00-${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.replit.dev`).origin : null
  ].filter(Boolean),
  // Proxy API requests to the NestJS server
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
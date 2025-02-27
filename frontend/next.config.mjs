/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scuola-santamarta.s3.eu-north-1.amazonaws.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://santamarta-backend.onrender.com/:path*',
      },
    ]
  }
};

export default nextConfig;

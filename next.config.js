/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        // protocol: 'https',
        hostname: process.env.NEXT_IMAGE_DOMAIN,
        // port: '',
        // pathname: '/sites/default/files/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/search',
        destination: '/api/search',
      },
    ]
  },
}

module.exports = nextConfig

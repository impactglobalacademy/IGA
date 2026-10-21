import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'localhost',
      'localhost:3000',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  eslint: {
    dirs: ['app', 'components', 'lib'],
  },
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;

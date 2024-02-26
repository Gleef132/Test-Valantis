/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/TestValantis',
  distDir: 'dist',
};

module.exports = nextConfig

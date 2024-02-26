/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/TestValantis',
  distDir: 'out',
};

module.exports = nextConfig

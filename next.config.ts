import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 빌드 중 ESLint 체크 비활성화
  },
};

module.exports = {
  images: {
    domains: ['avatars.githubusercontent.com', 'github.githubassets.com'],
  },
};

export default nextConfig;

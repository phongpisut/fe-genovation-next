import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
          protocol: 'https',
          hostname: 'api.dicebear.com',
          port: '',
          pathname: '**',
      },
  ],
  },
};

export default nextConfig;

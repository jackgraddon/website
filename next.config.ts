import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
    basePath: process.env.NODE_ENV === 'production' ? '/website-beta' : '/',
    images: {
      unoptimized: true,
    },
    env: {
      NEXT_PUBLIC_APP_NAME: "Jack Graddon's Beta Website",
    }
};

export default nextConfig;

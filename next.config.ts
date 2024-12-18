import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
    images: {
      unoptimized: true,
    },
    env: {
      NEXT_PUBLIC_APP_NAME: "Jack Graddon's Beta Website",
    },
    module: {
        extends: ['nextjs'],
    },
};

export default nextConfig;

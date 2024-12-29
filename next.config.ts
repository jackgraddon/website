// noinspection SpellCheckingInspection

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  sassOptions: {
    additionalData: `
      $mobile-width: 480px
      $tablet-width: 768px
      $desktop-width: 1024px`
  },
  env: {
    NEXT_PUBLIC_APP_NAME: "Jack Graddon's Beta Website",
  },
  module: {
      extends: ['nextjs'],
  },
};

export default nextConfig;
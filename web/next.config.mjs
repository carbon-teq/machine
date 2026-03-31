import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  serverExternalPackages: ['@takumi-rs/image-response'],
  // Remove transpilePackages to avoid re-compiling manim-web with server logic
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 1. Tell Webpack to ignore these modules on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        child_process: false,
        net: false,
        tls: false,
      };
      
      // 2. Explicitly alias them to false (empty module) to be safe
      config.resolve.alias = {
        ...config.resolve.alias,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/docs/:path*',
      },
    ];
  },
};

export default withMDX(config);

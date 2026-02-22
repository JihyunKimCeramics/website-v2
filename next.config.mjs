import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  experimental: {
    outputFileTracingIncludes: {
      "/*": [
        "node_modules/stripe/package.json",
        "node_modules/stripe/esm/**",
        "node_modules/stripe/cjs/**",
      ],
    },
  },
};

export default nextConfig;

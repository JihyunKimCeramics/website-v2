/** @type {import('next').NextConfig} */
const nextConfig = {
  // keep your Tina admin rewrite
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },

  // 👇 ensure Stripe's ESM/CJS files are included in the traced output
  outputFileTracingIncludes: {
    "*": [
      "node_modules/stripe/package.json",
      "node_modules/stripe/esm/**",
      "node_modules/stripe/cjs/**",
    ],
  },
};

export default nextConfig;

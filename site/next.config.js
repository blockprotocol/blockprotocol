const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: ["true", "1"].includes(process.env.ANALYZE),
});

// @ts-check

/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["page.ts", "page.tsx", "api.ts"],

  // We call linters in GitHub Actions for all pull requests. By not linting
  // again during `next build`, we save CI minutes and unlock more feedback.
  // Thus, we can get Playwright test results and Preview releases for WIP PRs.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  redirects: () => {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/PefPteFe5j",
        permanent: true,
      },
      {
        source: "/faq",
        destination: "/docs/faq",
        permanent: true,
      },
      {
        source: "/partners",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/partners/submitted",
        destination: "/contact/submitted",
        permanent: true,
      },
    ];
  },

  rewrites: () => {
    return [
      {
        source: "/:shortname/blocks/:blockslug/sandboxed-demo",
        destination: "/api/rewrites/sandboxed-block-demo",
      },
      {
        source: "/types/services/:servicename/:typename",
        destination: "/types/services/:servicename/:typename.json",
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);

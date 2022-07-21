const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({
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
      {
        source: "/docs/publishing-blocks",
        destination: "/docs/developing-blocks#publish",
        permanent: true,
      },
      {
        source: "/spec/:slug*",
        destination: "/docs/spec/:slug*",
        permanent: true,
      },
      {
        source: "/docs/spec/block-types",
        destination: "/docs/spec/core-specification",
        permanent: true,
      },
      {
        source: "/spec/block-types",
        destination: "/docs/spec/core-specification",
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
      {
        source: "/types/core/:typename",
        destination: "/types/core/:typename.json",
      },
    ];
  },
  i18n: {
    locales: ["en-US", "zh-CN"],
    defaultLocale: "en-US",
  },
};

export default withBundleAnalyzer(nextConfig);

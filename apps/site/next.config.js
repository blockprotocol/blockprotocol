const { withSentryConfig } = await import("@sentry/nextjs");

const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({
  enabled: ["true", "1"].includes(process.env.ANALYZE),
});

// @ts-check

/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    // @see `deleteIsrFilesCreatedAfterNextBuild()` for rationale
    isrMemoryCacheSize: 0,
  },
  pageExtensions: ["page.ts", "page.tsx", "api.ts"],
  productionBrowserSourceMaps: true,
  swcMinify: true,

  sentry: {
    autoInstrumentServerFunctions: false,
    hideSourceMaps: false,
  },
  transpilePackages: ["internal-api-repo"],

  // We call linters in GitHub Actions for all pull requests. By not linting
  // again during `next build`, we save CI minutes and unlock more feedback.
  // Thus, we can get Playwright test results and Preview releases for WIP PRs.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async headers() {
    return [
      {
        /**
         * allow fetching types as JSON from anywhere
         * @see ./src/middleware.page.ts for middleware which serves the JSON
         */
        source: "/:shortname/types/:path*",
        has: [
          {
            type: "header",
            key: "accept",
            value: "(.*application/json.*)",
          },
        ],
        headers: [
          {
            key: "access-control-allow-origin",
            value: "*",
          },
        ],
      },
    ];
  },

  redirects: () => {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/fnQ3qGcGQJ",
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
        destination: "/docs/spec/core",
        permanent: true,
      },
      {
        source: "/spec/block-types",
        destination: "/docs/spec/core",
        permanent: true,
      },
      {
        source: "/docs/spec/core-specification",
        destination: "/docs/spec/core",
        permanent: true,
      },
      {
        source: "/docs/spec/graph-module-specification",
        destination: "/docs/spec/graph-module",
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
        source: "/types/modules/:modulename/:typename",
        destination: "/types/modules/:modulename/:typename.json",
      },
      {
        source: "/types/core/:typename",
        destination: "/types/core/:typename.json",
      },
    ];
  },
};

/** @type {Partial<import("@sentry/nextjs").SentryWebpackPluginOptions>} */
const sentryWebpackPluginOptions = {
  dryRun: !process.env.SENTRY_AUTH_TOKEN,
  silent: true,
};

export default withSentryConfig(
  withBundleAnalyzer(nextConfig),
  sentryWebpackPluginOptions,
);

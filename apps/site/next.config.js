const { withSentryConfig } = await import("@sentry/nextjs");

const withBundleAnalyzer = (await import("@next/bundle-analyzer")).default({
  enabled: ["true", "1"].includes(process.env.ANALYZE),
});

// @ts-check

/** @type {import("next").NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    // @see `deleteIsrFilesCreatedAfterNextBuild()` for rationale
    isrMemoryCacheSize: 0,
  },
  pageExtensions: ["page.ts", "page.tsx", "api.ts"],
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  swcMinify: true,

  sentry: {
    autoInstrumentServerFunctions: false,
    hideSourceMaps: false,
  },
  transpilePackages: [
    "internal-api-repo",
    "@hashintel/design-system",
    "@hashintel/type-editor",
  ],

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
        destination:
          "https://github.com/blockprotocol/blockprotocol/discussions",
        permanent: true,
      },
      {
        source: "/discuss",
        destination:
          "https://github.com/blockprotocol/blockprotocol/discussions",
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
        destination: "/docs/blocks#publish",
        permanent: true,
      },
      {
        source: "/docs/working-with-services",
        destination: "/docs/services",
        permanent: false,
      },
      {
        source: "/docs/developing-blocks",
        destination: "/docs/blocks/develop",
        permanent: false,
      },
      {
        source: "/docs/using-blocks",
        destination: "/docs/blocks/environments",
        permanent: false,
      },
      {
        source: "/docs/spec/:slug*",
        destination: "/spec/:slug*",
        permanent: true,
      },
      {
        source: "/docs/roadmap",
        destination: "/roadmap",
        permanent: true,
      },
      {
        source: "/spec/block-types",
        destination: "/spec/core",
        permanent: true,
      },
      {
        source: "/spec/block-types",
        destination: "/spec/core",
        permanent: true,
      },
      {
        source: "/spec/core-specification",
        destination: "/spec/core",
        permanent: true,
      },
      {
        source: "/spec/graph-module-specification",
        destination: "/spec/graph",
        permanent: true,
      },
      {
        source: "/spec/graph-service",
        destination: "/spec/graph",
        permanent: true,
      },
      {
        source: "/spec/graph-module",
        destination: "/spec/graph",
        permanent: true,
      },
      {
        source: "/spec/hook-service",
        destination: "/spec/hook",
        permanent: true,
      },
      {
        source: "/spec/hook-module",
        destination: "/spec/hook",
        permanent: true,
      },
      {
        source: "/spec/service-module",
        destination: "/spec/service",
        permanent: true,
      },
      {
        source: "/spec/rfcs_and_roadmap",
        destination: "/roadmap",
        permanent: true,
      },
      {
        source: "/docs/embedding-blocks",
        destination: "/docs/blocks#your-own-application",
        permanent: true,
      },
      {
        source: "/settings/:slug*",
        destination: "/account/:slug*",
        permanent: true,
      },
      {
        source: "/account",
        destination: "/account/general",
        permanent: true,
      },
      {
        source: "/:shortname/all-types",
        destination: "/:shortname/types",
        permanent: true,
      },
    ];
  },

  rewrites: () => {
    return [
      {
        source: "/blocks/:shortname/:blockslug/block-metadata.json",
        destination: "/api/rewrites/block-metadata",
      },
      {
        source: "/:shortname/blocks/:blockslug/sandboxed-demo",
        destination: "/api/rewrites/sandboxed-block-demo",
      },
      {
        source: "/types/modules/:modulename/:typename*",
        destination: "/types/modules/:modulename/:typename*.json",
      },
      {
        source: "/legal/terms/dpa/attachment-:number",
        destination: "/legal/terms/dpa/attachment-:number.pdf",
      },
      {
        source: "/types/core/:typename",
        destination: "/types/core/:typename.json",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.blockprotocol.com",
        port: "",
        pathname: "/cdn-cgi/imagedelivery/**",
      },
    ],
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

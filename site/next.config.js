const withImages = require("next-images");
const withFonts = require("next-fonts");

module.exports = withFonts(
  withImages({
    pageExtensions: ["page.ts", "page.tsx", "api.ts"],
    optimizeFonts: true,

    // We call linters in GitHub Actions for all pull requests. By not linting
    // again during `next build`, we save CI minutes and unlock more feedback.
    // Thus, we can get Playwright test results and Preview releases for WIP PRs.
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    async redirects() {
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
  }),
);

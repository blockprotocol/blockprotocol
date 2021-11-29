const withImages = require("next-images");
const withFonts = require("next-fonts");

module.exports = withFonts(
  withImages({
    pageExtensions: ["page.ts", "page.tsx", "api.ts"],
    webpack5: false,
    optimizeFonts: true,
    async redirects() {
      return [{ source: "/", destination: "/partners", permanent: false }];
    },
  }),
);

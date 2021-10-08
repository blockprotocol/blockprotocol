
const withImages = require("next-images");

module.exports = withImages({
  pageExtensions: ["page.ts", "page.tsx"],
  webpack5: false,
  optimizeFonts: true,
  async redirects() {
    return [{ source: "/", destination: "/partners", permanent: false }]
  }
});

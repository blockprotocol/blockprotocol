/**
 * Type declaration for the generated site-map.json file.
 * This file is generated during the build process by scripts/generate-sitemap.ts
 * and doesn't exist at compile time, so we need to declare its module type.
 */
declare module "*/site-map.json" {
  import type { SiteMap } from "./src/lib/sitemap";
  const siteMap: SiteMap;
  export default siteMap;
}

declare module "../site-map.json" {
  import type { SiteMap } from "./src/lib/sitemap";
  const siteMap: SiteMap;
  export default siteMap;
}

declare module "../../site-map.json" {
  import type { SiteMap } from "./src/lib/sitemap";
  const siteMap: SiteMap;
  export default siteMap;
}

declare module "../../../site-map.json" {
  import type { SiteMap } from "./src/lib/sitemap";
  const siteMap: SiteMap;
  export default siteMap;
}

import { writeFileSync } from "fs";
import path from "path";
import { generateSiteMap } from "../src/lib/sitemap";

const script = async () => {
  const sitemap = generateSiteMap();

  writeFileSync(
    path.join(process.cwd(), `site-map.json`),
    JSON.stringify(sitemap, null, "\t"),
  );

  console.log("✅ Generated site map");
};

export default script();

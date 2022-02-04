import { writeFileSync } from "fs";
import path from "path";
import chalk from "chalk";
import { generateSiteMap } from "../src/lib/sitemap";

const script = async () => {
  console.log(chalk.bold("Generating sitemap..."));

  const sitemap = generateSiteMap();

  writeFileSync(
    path.join(process.cwd(), `site-map.json`),
    JSON.stringify(sitemap, null, "\t"),
  );

  console.log("✅ Site map generated");
};

export default script();

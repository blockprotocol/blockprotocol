import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { generateSiteMap } from "../src/lib/sitemap";

const script = async () => {
  console.log(chalk.bold("Generating sitemap..."));

  const sitemap = generateSiteMap();

  const siteMapFilePath = path.join(process.cwd(), `site-map.json`);
  await fs.writeJson(siteMapFilePath, sitemap, { spaces: "\t" });

  console.log(`✅ Site map generated: ${siteMapFilePath}`);
};

export default script();

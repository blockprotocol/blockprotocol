import chalk from "chalk";
import fs from "fs-extra";
import { globby } from "globby";

const script = async () => {
  console.log(
    chalk.bold("Making block assets compatible with Vercel lambdas.."),
  );

  // We need README.md to be added to Vercel lambdas so that they can be displayed
  // on the block pages. Next.js uses @vercel/nft to determine which files to include.
  // README.md and a few other file asset names are permanently excluded:
  // https://github.com/vercel/nft/blob/42defbaff909c2fedb5f8a385fed97c4c4f4713b/src/analyze.ts#L175
  // As a workaround, we copy README.md to README.vercel-hack.md, which does the job.
  //
  // It was also attempted to use fetch() instead of local file system calls. The calls
  // were hitting auth wall, possibly due to how internal Vercel security is implemented.
  // Details (internal): https://hashintel.slack.com/archives/C02TWBTT3ED/p1654895161511879

  const readmeFilePaths = await globby(
    `${process.cwd()}/public/blocks/**/README.md`,
    { absolute: true },
  );
  for (const readmeFilePath of readmeFilePaths) {
    await fs.copyFile(
      readmeFilePath,
      readmeFilePath.replace(/.md$/, ".vercel-hack.md"),
    );
  }

  console.log(
    `✅ README files copied: ${readmeFilePaths.length} (*.md → *.vercel-hack.md)`,
  );
};

await script();

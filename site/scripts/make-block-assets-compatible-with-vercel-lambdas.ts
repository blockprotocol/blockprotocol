import chalk from "chalk";
import fs from "fs-extra";
import glob from "glob";

const script = async () => {
  console.log(
    chalk.bold("Making block assets compatible with Vercel lambdas.."),
  );

  const readmeFilePaths = glob.sync(
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

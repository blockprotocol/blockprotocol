const { promisify } = require("util");
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");

const exec = promisify(child_process.exec);

(async () => {
  const blockName = process.argv[2];
  const blockPath = process.argv[3];

  if (!blockName || !blockPath) {
    console.error(
      "Please supply a block name and block path as an argument to the script.",
    );
    process.exit();
  }

  const resolvedBlockPath = path.resolve(blockPath);

  try {
    fs.statSync(resolvedBlockPath);
    console.error(
      `${resolvedBlockPath} already exists, please specify another path!`,
    );
    process.exit();
  } catch {
    // noop (we expect statSync to fail)
  }

  console.log("Copying required files...");

  await exec(`mkdir -p ${path.dirname(resolvedBlockPath)}`);
  await exec(`cp -R ${__dirname}/../../block-template ${resolvedBlockPath}`);

  console.log("Writing metadata...");

  const packageJsonPath = `${resolvedBlockPath}/package.json`;
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

  packageJson.name = blockName;
  packageJson.description = `${blockName} block`;

  try {
    const { stdout } = await exec("git config --get user.name");
    packageJson.author = stdout.trim();
  } catch {
    delete packageJson.author;
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, undefined, 2));

  console.log(
    `Your ${blockName} block is ready to code in ${resolvedBlockPath}`,
  );
})();

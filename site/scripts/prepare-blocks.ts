import chalk from "chalk";
import execa from "execa";
import path from "path";
import fs from "fs-extra";
import glob from "glob";
import micromatch from "micromatch";
import * as envalid from "envalid";
import md5 from "md5";
import Ajv, { JSONSchemaType } from "ajv";
import tmp from "tmp-promise";

const monorepoRoot = path.resolve(__dirname, "../..");

const defaultExecaOptions = {
  env: {
    NODE_ENV: "development",
    PATH: process.env.PATH,
  },
  extendEnv: false,
  stdio: "inherit",
} as const;

interface BlockInfo {
  repository: string;
  commit: string;

  distDir?: string;
  folder?: string;
  workspace?: string;
}

const blockInfoSchema: JSONSchemaType<BlockInfo> = {
  type: "object",
  properties: {
    repository: { type: "string" },
    commit: { type: "string" },

    distDir: { type: "string", nullable: true },
    folder: { type: "string", nullable: true },
    workspace: { type: "string", nullable: true },
  },
  required: ["repository", "commit"],
  additionalProperties: false, // protects against typos in field names
};

const ajv = new Ajv();
const validateBlockInfoSchema = ajv.compile(blockInfoSchema);

interface FullBlockInfo extends BlockInfo {
  name: string;
}

const listFullBlockInfos = async (
  blockInfosDirPath: string,
): Promise<FullBlockInfo[]> => {
  const blockInfoPaths = glob.sync("**/*.json", { cwd: blockInfosDirPath });
  console.log(`Block source infos found in HUB_DIR: ${blockInfoPaths.length}`);

  const result: FullBlockInfo[] = [];

  for (const blockInfoPath of blockInfoPaths) {
    try {
      const [, blockVendorName, blockNameWithinVendor] =
        blockInfoPath.match(/^@([\w-]+)\/([\w-]+).json$/) ?? [];

      if (!blockVendorName || !blockNameWithinVendor) {
        throw new Error(
          "Unable to derive block vendor and name. Make sure it matches `@vendor/name` and contains only alphanumeric characters of hyphens.",
        );
      }

      const blockInfo = (await fs.readJSON(
        path.resolve(blockInfosDirPath, blockInfoPath),
      )) as unknown;

      if (validateBlockInfoSchema(blockInfo)) {
        result.push({
          name: `@${blockVendorName}/${blockNameWithinVendor}`,
          ...blockInfo,
        });
      } else {
        throw new Error(
          `${
            validateBlockInfoSchema.errors
              ?.map((error) => error.message)
              .join("\n") ?? ""
          }`,
        );
      }
    } catch (error) {
      console.log(chalk.red(`Ignoring ${blockInfoPath}. ${error}`));
    }
  }

  return result;
};

const getFileModifiedAt = async (
  filePath: string,
): Promise<number | undefined> => {
  try {
    return (await fs.stat(filePath)).mtimeMs;
  } catch {
    return undefined;
  }
};

const findWorkspaceDirPath = async (
  workingDirPath: string,
  workspaceName: string,
) => {
  try {
    const { stdout } = await execa("yarn", ["--silent", "workspaces", "info"], {
      cwd: workingDirPath,
    });
    return JSON.parse(stdout)[workspaceName].location;
  } catch {
    throw new Error(`Unable to find workspace ${workspaceName}`);
  }
};

const prepareBlock = async ({
  fullBlockInfo,
  blockDirPath,
  validateLockfile,
}: {
  fullBlockInfo: FullBlockInfo;
  blockDirPath: string;
  validateLockfile: boolean;
}) => {
  const { path: tempDirPath, cleanup } = await tmp.dir({ unsafeCleanup: true });

  try {
    if (
      !fullBlockInfo.repository.match(
        /^https:\/\/github.com\/[\w-]+\/[\w-]+(\/|.git)?$/i,
      )
    ) {
      if (fullBlockInfo.repository.startsWith("https?://github.com")) {
        throw new Error(
          `Cannot handle repository URL ${fullBlockInfo.repository}. Only GitHub links are currently supported. We will add more services based on the demand.`,
        );
      } else {
        throw new Error(
          `Cannot handle repository URL ${fullBlockInfo.repository}. It needs to match https://github.com/org/repo`,
        );
      }
    }
    const cleanedRepoUrl = fullBlockInfo.repository
      .replace(/(\/|.git)$/i, "")
      .toLowerCase();
    const zipUrl = `${cleanedRepoUrl}/archive/${fullBlockInfo.commit}.zip`;

    console.log(chalk.green(`Downloading ${zipUrl}...`));
    // @todo consider finding cross-platform NPM packages for curl and unzip commands
    await execa(
      "curl",
      ["-sL", "-o", path.resolve(tempDirPath, "repo.zip"), zipUrl],
      defaultExecaOptions,
    );

    const unzipPath = path.resolve(tempDirPath, "repo");
    console.log(chalk.green(`Unpacking archive to ${unzipPath}...`));
    await execa(
      "unzip",
      ["-q", path.resolve(tempDirPath, "repo.zip"), "-d", unzipPath],
      defaultExecaOptions,
    );

    const innerDir = await fs.readdir(unzipPath);
    const repoDirPath = path.resolve(unzipPath, innerDir[0]!);

    const rootWorkspaceDirPath = fullBlockInfo.folder
      ? path.resolve(repoDirPath, fullBlockInfo.folder)
      : repoDirPath;

    if (path.relative(repoDirPath, rootWorkspaceDirPath).startsWith("..")) {
      throw new Error(
        `Value of "folder" is invalid: ${rootWorkspaceDirPath}. The folder must be within the repo.`,
      );
    }

    const workspaceDirPath = fullBlockInfo.workspace
      ? path.resolve(
          rootWorkspaceDirPath,
          await findWorkspaceDirPath(
            rootWorkspaceDirPath,
            fullBlockInfo.workspace,
          ),
        )
      : rootWorkspaceDirPath;

    const distDirPath = fullBlockInfo.distDir
      ? path.resolve(workspaceDirPath, fullBlockInfo.distDir)
      : workspaceDirPath;

    const packageLockJsonPath = path.resolve(
      rootWorkspaceDirPath,
      "package-lock.json",
    );
    const packageLockJsonModifiedAt = await getFileModifiedAt(
      packageLockJsonPath,
    );

    const yarnLockPath = path.resolve(rootWorkspaceDirPath, "yarn.lock");
    const yarnLockModifiedAt = await getFileModifiedAt(yarnLockPath);

    if (validateLockfile && !packageLockJsonModifiedAt && !yarnLockModifiedAt) {
      console.log({ yarnLockPath, yarnLockModifiedAt });
      throw new Error(
        `Could not find yarn.lock or package-lock.json in ${
          fullBlockInfo.folder ? `folder ${fullBlockInfo.folder} of ` : ""
        }the downloaded repository archive`,
      );
    }

    const packageManager = packageLockJsonModifiedAt ? "npm" : "yarn";
    if (packageManager === "npm" && fullBlockInfo.workspace) {
      throw new Error(
        'Using "workspace" param is not compatible with npm (please remove this field from block info or package-lock.json from the repo)',
      );
    }

    if (distDirPath !== repoDirPath) {
      console.log(chalk.green(`Installing dependencies...`));
      // @todo explore focus mode to speed up yarn install in monorepos
      // https://classic.yarnpkg.com/lang/en/docs/cli/install/#toc-yarn-install-focus
      // https://yarnpkg.com/cli/workspaces/focus
      await execa(packageManager, ["install"], {
        cwd: rootWorkspaceDirPath,
        ...defaultExecaOptions,
      });

      console.log(chalk.green(`Building...`));
      if (packageManager === "yarn" && fullBlockInfo.workspace) {
        await execa("yarn", ["workspace", fullBlockInfo.workspace, "build"], {
          cwd: rootWorkspaceDirPath,
          ...defaultExecaOptions,
        });
      } else if (packageManager === "yarn") {
        await execa("yarn", ["build"], {
          cwd: rootWorkspaceDirPath,
          ...defaultExecaOptions,
        });
      } else {
        await execa("npm", ["run", "build"], {
          cwd: rootWorkspaceDirPath,
          ...defaultExecaOptions,
        });
      }
    }

    if (validateLockfile) {
      if (
        packageLockJsonModifiedAt &&
        packageLockJsonModifiedAt !==
          (await getFileModifiedAt(packageLockJsonPath))
      ) {
        throw new Error(
          `Installing dependencies changes package-lock.json. Please install dependencies locally and commit changes.`,
        );
      }
      if (
        yarnLockModifiedAt &&
        yarnLockModifiedAt !== (await getFileModifiedAt(yarnLockPath))
      ) {
        throw new Error(
          `Installing dependencies changes yarn.lock. Please install dependencies locally and commit changes.`,
        );
      }
    }

    console.log(chalk.green(`Moving files...`));
    await fs.ensureDir(path.dirname(blockDirPath));
    if (await fs.pathExists(blockDirPath)) {
      await fs.remove(blockDirPath);
    }

    await fs.move(distDirPath, blockDirPath);
    console.log(chalk.green(`Done!`));
  } finally {
    await cleanup();
  }
};

const script = async () => {
  console.log(chalk.bold("Preparing blocks..."));

  const env = envalid.cleanEnv(process.env, {
    BLOCK_NAME_FILTER: envalid.str({
      desc: "Optional glob you can use to prepare specific blocks.",
      example: "@hashintel/paragraph or @hashintel/*",
      default: "",
    }),
    BLOCKS_DIR: envalid.str({
      desc: "Location of ready-to-be-served blocks",
      default: path.resolve(monorepoRoot, "site/public/blocks"),
    }),
    BLOCK_INFOS_DIR: envalid.str({
      desc: "Location of block infos",
      default: path.resolve(monorepoRoot, "hub"),
    }),
    CACHE: envalid.bool({
      desc: "If set to false, blocks are prepared even if there is a cache hit.",
      default: true,
    }),
    VALIDATE_LOCKFILE: envalid.bool({
      desc: "If set to true, blocks with non-existing or unstable yarn.lock / package.json will not end up in BLOCKS_DIR.",
      default: true,
    }),
  });

  const blockInfosDirPath = path.resolve(env.BLOCK_INFOS_DIR);
  const blocksDirPath = path.resolve(env.BLOCKS_DIR);
  const blockNameFilter = env.BLOCK_NAME_FILTER;

  console.log(`HUB_DIR is resolved to ${blockInfosDirPath}`);
  console.log(`BLOCKS_DIR is resolved to ${blocksDirPath}`);

  const fullBlockInfos = await listFullBlockInfos(blockInfosDirPath);

  if (!fullBlockInfos.length) {
    throw new Error(
      "No valid block infos found, please make sure that HUB_DIR is correct and it contains valid JSON files.",
    );
  }

  const filteredFullBlockInfos = blockNameFilter
    ? fullBlockInfos.filter(({ name }) =>
        micromatch.any([name], blockNameFilter),
      )
    : fullBlockInfos;

  const numberOfBlocksThatDontMatchFilter =
    fullBlockInfos.length - filteredFullBlockInfos.length;

  if (numberOfBlocksThatDontMatchFilter > 0) {
    console.log(
      chalk.gray(
        `Number of blocks skipped: ${numberOfBlocksThatDontMatchFilter} (names do not match BLOCK_NAME_FILTER=${blockNameFilter})`,
      ),
    );
  }

  for (const fullBlockInfo of filteredFullBlockInfos) {
    const blockName = fullBlockInfo.name;
    const blockDirPath = path.resolve(blocksDirPath, blockName);
    const blockMetadataPath = path.resolve(blockDirPath, "block-metadata.json");
    const blockInfoChecksum = md5(JSON.stringify(fullBlockInfo));

    if (env.CACHE) {
      try {
        const existingBlockMetadata = await fs.readJson(blockMetadataPath);
        if (
          blockInfoChecksum === existingBlockMetadata.unstable_hubInfo.checksum
        ) {
          console.log("");
          console.log(
            chalk.gray(`Block ${chalk.bold(blockName)} is up-to-date.`),
          );

          continue;
        }
      } catch {
        // noop (if checksum matching failed, we prepare the block)
      }
    }

    console.log("");
    console.log(chalk.blue(`Block ${chalk.bold(blockName)} needs preparing.`));

    try {
      await fs.ensureDir(blockDirPath);
      await prepareBlock({
        fullBlockInfo,
        blockDirPath,
        validateLockfile: env.VALIDATE_LOCKFILE,
      });

      const blockMetadata = await fs.readJson(blockMetadataPath);
      blockMetadata.unstable_hubInfo = {
        checksum: blockInfoChecksum,
        commit: fullBlockInfo.commit,
        preparedAt: new Date().toISOString(),
      };
      await fs.writeJson(blockMetadataPath, blockMetadata, { spaces: 2 });
    } catch (error) {
      console.log(
        chalk.red(
          `Block ${chalk.bold(`${blockName}`)} could not be prepared. ${error}`,
        ),
      );

      await fs.remove(blockDirPath);

      console.log(
        chalk.yellow(
          `Directory ${blockDirPath} was cleared to avoid broken blocks in the hub.`,
        ),
      );
    }
  }

  // @todo Cleanup unknown blocks if blockNameFilter is empty.
  // As a workaround, we can clear CI cache for now.
};

export default script();

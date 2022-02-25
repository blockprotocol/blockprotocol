/**
 * This script converts JSON block infos into a folder with static block files.
 * It downloads and builds block sources for that. The result of this script is
 * then served by the Next.js app on Vercel.
 *
 * To avoid unnecessary rebuilds, this script puts unstable_hubInfo.checksum into
 * each block-metadata.json file. This checksum is matched against the block info
 * in subsequent runs to find cache matches.
 *
 * We plan to separate block artifacts from the Vercel deployment in the future.
 * This script will be removed, but its parts will be recycled.
 */
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
import slugify from "slugify";
import { StoredBlockInfo } from "../src/lib/blocks";

const monorepoRoot = path.resolve(__dirname, "../..");

const defaultExecaOptions = {
  env: {
    NODE_ENV: "development",
    PATH: process.env.PATH,
  },
  extendEnv: false,
  stdio: "inherit",
} as const;

const storedBlockInfoSchema: JSONSchemaType<StoredBlockInfo> = {
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
const validateStoredBlockInfo = ajv.compile(storedBlockInfoSchema);

interface BlockInfo extends StoredBlockInfo {
  name: string;
}

/**
 * Reads and validates JSON files a given directory with block infos.
 */
const listBlockInfos = async (
  blockInfosDirPath: string,
): Promise<BlockInfo[]> => {
  const blockInfoPaths = glob.sync("**/*.json", { cwd: blockInfosDirPath });
  console.log(`Block source infos found in HUB_DIR: ${blockInfoPaths.length}`);

  const result: BlockInfo[] = [];

  for (const blockInfoPath of blockInfoPaths) {
    try {
      const [, blockVendorName, blockNameWithinVendor] =
        blockInfoPath.match(/^@([\w-]+)\/([\w-]+).json$/) ?? [];

      if (!blockVendorName || !blockNameWithinVendor) {
        throw new Error(
          "Unable to derive block vendor and name. Make sure it matches `@vendor/name` and contains only alphanumeric characters of hyphens.",
        );
      }

      const storedBlockInfo = (await fs.readJSON(
        path.resolve(blockInfosDirPath, blockInfoPath),
      )) as unknown;

      if (validateStoredBlockInfo(storedBlockInfo)) {
        result.push({
          name: `@${blockVendorName}/${blockNameWithinVendor}`,
          ...storedBlockInfo,
        });
      } else {
        throw new Error(
          `${
            validateStoredBlockInfo.errors
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

/**
 * Downloads repository snapshot (only supports GitHub repos for now)
 *
 * @returns directory path that contains downloaded repository files
 */
const ensureRepositorySnapshot = async ({
  repositoryHref,
  commit,
  workshopDirPath,
}: {
  repositoryHref: string;
  commit: string;
  workshopDirPath: string;
}): Promise<string> => {
  if (
    !repositoryHref.match(/^https:\/\/github.com\/[\w-]+\/[\w-]+(\/|.git)?$/i)
  ) {
    if (repositoryHref.startsWith("https?://github.com")) {
      throw new Error(
        `Cannot handle repository URL ${repositoryHref}. Only GitHub links are currently supported. We will add more services based on the demand.`,
      );
    } else {
      throw new Error(
        `Cannot handle repository URL ${repositoryHref}. It needs to match https://github.com/org/repo`,
      );
    }
  }

  const normalizedRepoUrl = repositoryHref
    .replace(/(\/|.git)$/i, "")
    .toLowerCase();
  const zipUrl = `${normalizedRepoUrl}/archive/${commit}.zip`;
  const repositorySnapshotSlug = slugify(
    `${normalizedRepoUrl.replace("https://", "")}-${commit}`,
    {},
  );

  const repositorySnapshotDirPath = path.resolve(
    workshopDirPath,
    repositorySnapshotSlug,
  );

  if (await fs.pathExists(repositorySnapshotDirPath)) {
    console.log(
      chalk.gray(
        `Reusing existing repository snapshot in ${repositorySnapshotDirPath}`,
      ),
    );
    return repositorySnapshotDirPath;
  }

  const { path: unzipDirPath, cleanup: cleanupUnzipDirPath } = await tmp.dir({
    unsafeCleanup: true,
  });

  try {
    console.log(chalk.green(`Downloading ${zipUrl}...`));
    // @todo Consider finding cross-platform NPM packages for curl and unzip commands
    await execa(
      "curl",
      ["-sL", "-o", path.resolve(unzipDirPath, `repo.zip`), zipUrl],
      defaultExecaOptions,
    );

    console.log(chalk.green(`Unpacking archive...`));
    const unzipPath = path.resolve(unzipDirPath, "repo");
    await execa(
      "unzip",
      ["-q", path.resolve(unzipDirPath, "repo.zip"), "-d", unzipPath],
      defaultExecaOptions,
    );

    const innerDir = await fs.readdir(unzipPath);
    await fs.move(
      path.resolve(unzipPath, innerDir[0]!),
      repositorySnapshotDirPath,
    );

    console.log(`Repository snapshot ready in ${repositorySnapshotDirPath}`);
    return repositorySnapshotDirPath;
  } finally {
    await cleanupUnzipDirPath();
  }
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

const locateWorkspaceDirPath = async (
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

/**
 * Downloads repository snapshot or reuses the existing one, then installs
 * dependencies and runs the build command. Exits with error if `validateLockfile`
 * is `true`, but a lock file does not exist or changes on install.
 */
const prepareBlock = async ({
  blockInfo,
  blockDirPath,
  workshopDirPath,
  validateLockfile,
}: {
  blockInfo: BlockInfo;
  blockDirPath: string;
  workshopDirPath: string;
  validateLockfile: boolean;
}) => {
  const repositorySnapshotDirPath = await ensureRepositorySnapshot({
    repositoryHref: blockInfo.repository,
    commit: blockInfo.commit,
    workshopDirPath,
  });

  const rootWorkspaceDirPath = blockInfo.folder
    ? path.resolve(repositorySnapshotDirPath, blockInfo.folder)
    : repositorySnapshotDirPath;

  if (
    path
      .relative(repositorySnapshotDirPath, rootWorkspaceDirPath)
      .startsWith("..")
  ) {
    throw new Error(
      `Value of "folder" is invalid: ${rootWorkspaceDirPath}. The folder must be within the repo.`,
    );
  }

  const workspaceDirPath = blockInfo.workspace
    ? path.resolve(
        rootWorkspaceDirPath,
        await locateWorkspaceDirPath(rootWorkspaceDirPath, blockInfo.workspace),
      )
    : rootWorkspaceDirPath;

  const distDirPath = blockInfo.distDir
    ? path.resolve(workspaceDirPath, blockInfo.distDir)
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
    throw new Error(
      `Could not find yarn.lock or package-lock.json in ${
        blockInfo.folder ? `folder ${blockInfo.folder} of ` : ""
      }the downloaded repository archive`,
    );
  }

  const packageManager = packageLockJsonModifiedAt ? "npm" : "yarn";
  if (packageManager === "npm" && blockInfo.workspace) {
    throw new Error(
      'Using "workspace" param is not compatible with npm (please remove this field from block info or delete package-lock.json from the repo)',
    );
  }

  if (distDirPath !== repositorySnapshotDirPath) {
    console.log(chalk.green(`Installing dependencies...`));
    // @todo explore focus mode to speed up yarn install in monorepos
    // https://classic.yarnpkg.com/lang/en/docs/cli/install/#toc-yarn-install-focus
    // https://yarnpkg.com/cli/workspaces/focus
    await execa(packageManager, ["install"], {
      cwd: rootWorkspaceDirPath,
      ...defaultExecaOptions,
    });

    console.log(chalk.green(`Building...`));
    if (packageManager === "yarn" && blockInfo.workspace) {
      await execa("yarn", ["workspace", blockInfo.workspace, "build"], {
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
        `Installing dependencies changes package-lock.json. Please install dependencies locally and commit.`,
      );
    }
    if (
      yarnLockModifiedAt &&
      yarnLockModifiedAt !== (await getFileModifiedAt(yarnLockPath))
    ) {
      throw new Error(
        `Installing dependencies changes yarn.lock. Please install dependencies locally and commit.`,
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
};

const script = async () => {
  console.log(chalk.bold("Preparing blocks..."));

  const env = envalid.cleanEnv(process.env, {
    BLOCK_FILTER: envalid.str({
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
  const blockFilter = env.BLOCK_FILTER;

  console.log(`HUB_DIR is resolved to ${blockInfosDirPath}`);
  console.log(`BLOCKS_DIR is resolved to ${blocksDirPath}`);

  const blockInfos = await listBlockInfos(blockInfosDirPath);

  if (!blockInfos.length) {
    throw new Error(
      "No valid block infos found, please make sure that HUB_DIR is correct and it contains valid JSON files.",
    );
  }

  const filteredBlockInfos = blockFilter
    ? blockInfos.filter(({ name }) => micromatch.any(name, blockFilter))
    : blockInfos;

  const numberOfBlocksThatDontMatchFilter =
    blockInfos.length - filteredBlockInfos.length;

  if (numberOfBlocksThatDontMatchFilter > 0) {
    console.log(
      chalk.gray(
        `Number of blocks skipped: ${numberOfBlocksThatDontMatchFilter} (names do not match BLOCK_FILTER=${blockFilter})`,
      ),
    );
  }

  const { path: workshopDirPath, cleanup: cleanupWorkshopDirPath } =
    await tmp.dir({
      unsafeCleanup: true,
    });

  for (const blockInfo of filteredBlockInfos) {
    const blockName = blockInfo.name;
    const blockDirPath = path.resolve(blocksDirPath, blockName);
    const blockMetadataPath = path.resolve(blockDirPath, "block-metadata.json");
    const blockInfoChecksum = md5(JSON.stringify(blockInfo));

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
        blockInfo,
        blockDirPath,
        workshopDirPath,
        validateLockfile: env.VALIDATE_LOCKFILE,
      });

      const blockMetadata = await fs.readJson(blockMetadataPath);
      blockMetadata.unstable_hubInfo = {
        checksum: blockInfoChecksum,
        commit: blockInfo.commit,
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

  await cleanupWorkshopDirPath();

  // @todo Cleanup unknown blocks if blockNameFilter is empty.
  // As a workaround, we can clear CI cache for now.
};

export default script();

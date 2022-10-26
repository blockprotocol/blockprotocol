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
import path from "node:path";
import { fileURLToPath } from "node:url";

import _Ajv, { JSONSchemaType } from "ajv";
import chalk from "chalk";
import * as envalid from "envalid";
import { execa } from "execa";
import fs from "fs-extra";
import { globby } from "globby";
import hostedGitInfo from "hosted-git-info";
import md5 from "md5";
import micromatch from "micromatch";
import slugify from "slugify";
import tmp from "tmp-promise";

import {
  BlockMetadataOnDisk,
  expandBlockMetadata,
  ExpandedBlockMetadata,
  StoredBlockInfo,
} from "../src/lib/blocks.js";
import { FRONTEND_URL } from "../src/lib/config.js";

const Ajv = _Ajv as unknown as typeof _Ajv.default;

const monorepoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

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
): Promise<{ blockInfos: BlockInfo[]; errorMessages: string[] }> => {
  const blockInfoPaths = await globby("**/*.json", { cwd: blockInfosDirPath });
  console.log(`Block source infos found in HUB_DIR: ${blockInfoPaths.length}`);

  const blockInfos: BlockInfo[] = [];
  const errorMessages: string[] = [];

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
        blockInfos.push({
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
      errorMessages.push(`${blockInfoPath}: ${error}`);
    }
  }

  return { blockInfos, errorMessages };
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
  const tarballUrl = hostedGitInfo
    .fromUrl(repositoryHref)
    ?.tarball({ committish: commit });

  if (!tarballUrl) {
    throw new Error(
      `Cannot get tarball for repository URL ${repositoryHref}. It needs to be a valid repository URL.`,
    );
  }

  const repositorySnapshotSlug = slugify(
    tarballUrl.replace("https://", ""),
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

  // Vercel builds may fail when block build cache is empty. The error says
  // "Could not write file /tmp/..." "ENOSPC: no space left on device"
  // Preventing workshop folder from growing indefinitely reduces the chances of failure.
  // See details in https://github.com/blockprotocol/blockprotocol/pull/327
  // The same may happen in GitHub Workflows (integration tests) as the number of blocks grows.
  if (process.env.CI) {
    await fs.emptyDir(workshopDirPath);
  }

  const { path: tarDirPath, cleanup: cleanupTarDir } = await tmp.dir({
    unsafeCleanup: true,
  });

  try {
    console.log(chalk.green(`Downloading ${tarballUrl}...`));
    // @todo Consider finding cross-platform NPM packages for `curl` and `tar` commands
    await execa(
      "curl",
      ["-sL", "-o", path.resolve(tarDirPath, `repo.tar.gz`), tarballUrl],
      defaultExecaOptions,
    );

    const outputDirPath = path.resolve(tarDirPath, "repo");

    console.log(chalk.green(`Ensuring output directory exists...`));
    await fs.ensureDir(outputDirPath);

    console.log(chalk.green(`Unpacking archive...`));

    await execa(
      "tar",
      [
        "--extract",
        `--file=${path.resolve(tarDirPath, "repo.tar.gz")}`,
        `--directory=${outputDirPath}`,
      ],
      defaultExecaOptions,
    );

    const innerDirName = (await fs.readdir(outputDirPath))[0]!;

    await fs.move(
      path.resolve(outputDirPath, innerDirName),
      repositorySnapshotDirPath,
    );

    console.log(`Repository snapshot ready in ${repositorySnapshotDirPath}`);
    return repositorySnapshotDirPath;
  } finally {
    await cleanupTarDir();
  }
};

const extractFileChecksum = async (
  filePath: string,
): Promise<string | undefined> => {
  try {
    // Treating file contents as its checksum is generally a bad idea.
    // This approach is both simple and performant for the given context though.
    return await fs.readFile(filePath, "utf8");
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

  const workspacePath = blockInfo.workspace
    ? await locateWorkspaceDirPath(rootWorkspaceDirPath, blockInfo.workspace)
    : null;
  const workspaceDirPath = workspacePath
    ? path.resolve(rootWorkspaceDirPath, workspacePath)
    : rootWorkspaceDirPath;

  const distDirPath = blockInfo.distDir
    ? path.resolve(workspaceDirPath, blockInfo.distDir)
    : workspaceDirPath;

  const packageLockJsonPath = path.resolve(
    rootWorkspaceDirPath,
    "package-lock.json",
  );
  const packageLockJsonChecksum = await extractFileChecksum(
    packageLockJsonPath,
  );

  const yarnLockPath = path.resolve(rootWorkspaceDirPath, "yarn.lock");
  const yarnLockChecksum = await extractFileChecksum(yarnLockPath);

  if (validateLockfile && !packageLockJsonChecksum && !yarnLockChecksum) {
    throw new Error(
      `Could not find yarn.lock or package-lock.json in ${
        blockInfo.folder ? `folder ${blockInfo.folder} of ` : ""
      }the downloaded repository archive`,
    );
  }

  const packageManager = packageLockJsonChecksum ? "npm" : "yarn";
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
      packageLockJsonChecksum &&
      packageLockJsonChecksum !==
        (await extractFileChecksum(packageLockJsonPath))
    ) {
      throw new Error(
        `Installing dependencies changes package-lock.json. Please install dependencies locally and commit.`,
      );
    }

    if (
      yarnLockChecksum &&
      yarnLockChecksum !== (await extractFileChecksum(yarnLockPath))
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

  return {
    directory: workspacePath ?? blockInfo.folder,
  };
};

const script = async () => {
  console.log(chalk.bold("Preparing blocks..."));

  const env = envalid.cleanEnv(process.env, {
    BLOCK_FILTER: envalid.str({
      desc: "Optional glob you can use to prepare specific blocks.",
      example: "@hash/paragraph or @hash/*",
      default: "",
    }),
    BLOCKS_DIR: envalid.str({
      desc: "Location of ready-to-be-served blocks",
      default: path.resolve(monorepoRoot, "apps/site/public/blocks"),
    }),
    BLOCK_INFOS_DIR: envalid.str({
      desc: "Location of block infos",
      default: path.resolve(monorepoRoot, "hub"),
    }),
    CACHE: envalid.bool({
      desc: "If set to false, blocks are prepared even if there is a cache hit.",
      default: true,
    }),
    CONTINUE_ON_ERROR: envalid.bool({
      desc: "If set to true, a failure to read block info or to build does not result early exit.",
      default: false,
    }),
    VALIDATE_LOCKFILE: envalid.bool({
      desc: "If set to true, blocks with non-existing or unstable yarn.lock / package.json will not end up in BLOCKS_DIR.",
      default: true,
    }),
  });

  const blockInfosDirPath = path.resolve(env.BLOCK_INFOS_DIR);
  const blocksDirPath = path.resolve(env.BLOCKS_DIR);
  const blockFilter = env.BLOCK_FILTER;
  const continueOnError = env.CONTINUE_ON_ERROR;

  console.log(`HUB_DIR is resolved to ${blockInfosDirPath}`);
  console.log(`BLOCKS_DIR is resolved to ${blocksDirPath}`);

  const { blockInfos, errorMessages } = await listBlockInfos(blockInfosDirPath);

  if (errorMessages.length) {
    for (const errorMessage of errorMessages) {
      console.log(chalk.red(errorMessage));
    }
    if (!continueOnError) {
      process.exit(1);
    }
  }

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
    const blockInfoChecksum = md5(
      JSON.stringify({
        ...blockInfo,
        // This will allow you to force re-preparing all blocks when the
        // format of `unstable_hubInfo` changes, by incrementing this.
        unstableVersion: 3,
      }),
    );

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
      const hubInfo = await prepareBlock({
        blockInfo,
        blockDirPath,
        workshopDirPath,
        validateLockfile: env.VALIDATE_LOCKFILE,
      });

      const blockMetadata = await fs.readJson(blockMetadataPath);

      const exampleGraphFileExists = await fs.pathExists(
        blockMetadataPath.replace("block-metadata.json", "example-graph.json"),
      );

      const blockDistributionFolderUrl = `${FRONTEND_URL}/blocks/${blockName}`;

      const now = new Date().toISOString();

      const extendedBlockMetadata: ExpandedBlockMetadata = expandBlockMetadata({
        metadata: blockMetadata,
        source: {
          blockDistributionFolderUrl,
          pathWithNamespace: blockName,
          repoCommit: blockInfo.commit,
          repoDirectory: blockInfo.folder,
          repository: blockInfo.repository,
        },
        timestamps: {},
        includesExampleGraph: exampleGraphFileExists,
      });

      const blockMetadataToWrite: BlockMetadataOnDisk = {
        ...extendedBlockMetadata,
        unstable_hubInfo: {
          ...hubInfo,
          checksum: blockInfoChecksum,
          commit: blockInfo.commit,
          preparedAt: now,
          name: blockInfo.name,
        },
      };

      await fs.writeJson(blockMetadataPath, blockMetadataToWrite, {
        spaces: 2,
      });
    } catch (error) {
      console.log(
        chalk.red(
          `Block ${chalk.bold(`${blockName}`)} could not be prepared. ${error}`,
        ),
      );

      if (!continueOnError) {
        process.exit(1);
      }

      await fs.remove(blockDirPath);

      console.log(
        chalk.yellow(
          `Directory ${blockDirPath} was cleared to avoid broken blocks in the Hub.`,
        ),
      );
    }
  }

  await cleanupWorkshopDirPath();

  // @todo Cleanup unknown blocks if blockNameFilter is empty.
  // As a workaround, we can clear CI cache for now.
};

await script();

import { BlockMetadata, BlockMetadataRepository } from "blockprotocol";
import fs from "fs-extra";
import { sync as globSync } from "glob";
import hostedGitInfo from "hosted-git-info";

/** @todo type as JSON object */
export type BlockProps = object;

export type ExpandedBlockMetadata = BlockMetadata & {
  packagePath: string;
  repository?: string;
  lastUpdated?: string | null;
};

export type BuildConfig = {
  folder?: string | null;
  workspace?: string | null;
  repository: string;
  branch: string;
  distDir: string;
  timestamp?: string | null;
};

const getBlockMediaUrl = (
  mediaPath: string | undefined | null,
  packagePath: string,
): string | null => {
  if (!mediaPath) {
    return null;
  }
  const regex = /^(?:[a-z]+:)?\/\//i;
  if (regex.test(mediaPath)) {
    return mediaPath;
  }

  return `/blocks/${packagePath}/${mediaPath}`;
};

// this only runs on the server-side because hosted-git-info uses some nodejs dependencies
const getRepositoryUrl = (
  repository: BlockMetadataRepository | null,
): string | null => {
  if (typeof repository === "string") {
    const repositoryUrl = hostedGitInfo.fromUrl(repository)?.browse("");

    if (repositoryUrl) {
      return repositoryUrl;
    }

    return null;
  }

  const { url, directory } = repository ?? {};

  if (url) {
    const repositoryUrl = hostedGitInfo.fromUrl(url)?.browse(directory ?? "");

    if (repositoryUrl) {
      return repositoryUrl;
    }
  }

  return null;
};

/**
 * used to read block metadata from disk.
 *
 */
export const readBlocksFromDisk = (): ExpandedBlockMetadata[] => {
  return globSync(`${process.cwd()}/public/blocks/**/block-metadata.json`).map(
    (path: string) => {
      const packagePath = path.split("/").slice(-3, -1).join("/");

      const metadata: ExpandedBlockMetadata = {
        // @todo should be redundant to block's package.json#name
        packagePath,
        ...JSON.parse(fs.readFileSync(path, { encoding: "utf8" })),
      };

      const blockConfig: BuildConfig = JSON.parse(
        fs.readFileSync(`${process.cwd()}/../hub/${packagePath}.json`, {
          encoding: "utf8",
        }),
      );

      let blockRepository = metadata.repository ?? null;

      if (!blockRepository && blockConfig) {
        blockRepository = `${blockConfig.repository}#${blockConfig.branch}`;
      }

      let repository = getRepositoryUrl(blockRepository) ?? undefined;

      if (repository) {
        repository = repository.replace(/\/$/, "");
      }

      return {
        ...metadata,
        author: metadata.packagePath.split("/")[0].replace(/^@/, ""),
        icon: getBlockMediaUrl(metadata.icon, metadata.packagePath),
        image: getBlockMediaUrl(metadata.image, metadata.packagePath),
        repository,
        lastUpdated: blockConfig?.timestamp ?? null,
      };
    },
  );
};

export const readBlockDataFromDisk = ({
  packagePath,
  schema,
  source,
}: ExpandedBlockMetadata) => {
  // @todo update to also return the metadata information
  // @see https://github.com/blockprotocol/blockprotocol/pull/66#discussion_r784070161
  return {
    schema: fs.readJsonSync(
      `${process.cwd()}/public/blocks/${packagePath}/${schema}`,
    ),
    source: fs.readFileSync(
      `${process.cwd()}/public/blocks/${packagePath}/${source}`,
      "utf8",
    ),
  };
};

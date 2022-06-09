import { BlockMetadata, BlockMetadataRepository } from "blockprotocol";
import fs from "fs-extra";
import glob from "glob";
import hostedGitInfo from "hosted-git-info";

import { FRONTEND_URL } from "./config";

/** @todo type as JSON object */
export type BlockProps = object;

export type ExpandedBlockMetadata = BlockMetadata & {
  blockPackagePath: string;
  componentId: string;
  lastUpdated?: string | null;
  packagePath: string;
  // repository is passed down as a string upon expansion
  repository?: string;
  schema?: string | null;
};

export interface StoredBlockInfo {
  repository: string;
  commit: string;
  distDir?: string;
  folder?: string;
  workspace?: string;
}

// https://vercel.com/docs/runtimes#advanced-usage/technical-details/including-additional-files
// @todo Explain this hack if it works
const forceFsOnVercel = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,global-require
    const fakeFs = require("fs");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,global-require
    const fakeGlob = require("glob");
  } catch {
    // noop
  }
};

const generateBlockFileUrl = (
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

  return `${FRONTEND_URL}/blocks/${packagePath}/${mediaPath.replace(
    /^\//,
    "",
  )}`;
};

// this only runs on the server-side because hosted-git-info uses some nodejs dependencies
const getRepositoryUrl = (
  repository: BlockMetadataRepository | undefined,
  commit: string,
): string | undefined => {
  if (typeof repository === "string") {
    const repositoryUrl = hostedGitInfo
      .fromUrl(repository)
      ?.browse("", { committish: commit });

    if (repositoryUrl) {
      return repositoryUrl;
    }

    return undefined;
  }

  const { url, directory } = repository ?? {};

  if (url) {
    const repositoryUrl = hostedGitInfo
      .fromUrl(url)
      ?.browse(directory ?? "", { committish: commit });

    if (repositoryUrl) {
      return repositoryUrl;
    }
  }

  return undefined;
};

/**
 * used to read block metadata from disk.
 *
 */
export const readBlocksFromDisk = async (): Promise<
  ExpandedBlockMetadata[]
> => {
  forceFsOnVercel();

  return glob
    .sync(`${process.cwd()}/public/blocks/**/block-metadata.json`)
    .map((path: string): ExpandedBlockMetadata => {
      const packagePath = path.split("/").slice(-3, -1).join("/");

      const metadata: ExpandedBlockMetadata = {
        // @todo should be redundant to block's package.json#name
        componentId: `${FRONTEND_URL}/blocks/${packagePath}`,
        packagePath,
        ...JSON.parse(fs.readFileSync(path, { encoding: "utf8" })),
      };

      const storedBlockInfo: StoredBlockInfo = JSON.parse(
        fs.readFileSync(`${process.cwd()}/../hub/${packagePath}.json`, {
          encoding: "utf8",
        }),
      );

      const repository = getRepositoryUrl(
        metadata.repository ?? storedBlockInfo.repository,
        storedBlockInfo.commit,
      )?.replace(/\/$/, "");

      return {
        ...metadata,
        author: metadata.packagePath.split("/")[0]!.replace(/^@/, ""),
        icon: generateBlockFileUrl(metadata.icon, metadata.packagePath),
        image: generateBlockFileUrl(metadata.image, metadata.packagePath),
        source: generateBlockFileUrl(metadata.source, metadata.packagePath)!,
        variants: metadata.variants?.length
          ? metadata.variants?.map((variant) => ({
              ...variant,
              icon: generateBlockFileUrl(variant.icon, metadata.packagePath)!,
            }))
          : null,
        schema: generateBlockFileUrl(metadata.schema, metadata.packagePath)!,
        repository,
        blockPackagePath: `/${metadata.packagePath
          .split("/")
          .join("/blocks/")}`,
        lastUpdated: null, // TODO: derive from block data when provided by the hub
      };
    });
};

const blocksToHide = [
  "@hash/callout",
  "@hash/embed",
  "@hash/header",
  "@hash/paragraph",
];

/** Helps consistently hide certain blocks from the hub and user profile pages */
export const excludeHiddenBlocks = (
  blocks: ExpandedBlockMetadata[],
): ExpandedBlockMetadata[] => {
  return blocks.filter(
    ({ packagePath }) => !blocksToHide.includes(packagePath),
  );
};

export const readBlockDataFromDisk = async ({
  packagePath,
  schema: metadataSchema,
  source: metadataSource,
}: ExpandedBlockMetadata) => {
  forceFsOnVercel();

  // @todo update to also return the metadata information
  // @see https://github.com/blockprotocol/blockprotocol/pull/66#discussion_r784070161

  const schema = metadataSchema.startsWith(FRONTEND_URL)
    ? JSON.parse(
        fs.readFileSync(
          `${process.cwd()}/public/blocks/${packagePath}/${metadataSchema.substring(
            metadataSchema.lastIndexOf("/") + 1,
          )}`,
          { encoding: "utf8" },
        ),
      )
    : await fetch(metadataSchema).then((response) => response.json());

  const source = metadataSource.startsWith(FRONTEND_URL)
    ? fs.readFileSync(
        `${process.cwd()}/public/blocks/${packagePath}/${metadataSource.substring(
          metadataSource.lastIndexOf("/") + 1,
        )}`,
        { encoding: "utf8" },
      )
    : await fetch(metadataSource).then((response) => response.text());

  return {
    schema,
    source,
  };
};

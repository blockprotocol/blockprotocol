import { BlockMetadata, BlockMetadataRepository } from "@blockprotocol/core";
import fs from "fs-extra";
import { globby } from "globby";
import hostedGitInfo from "hosted-git-info";
import path from "node:path";

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
  exampleGraph: string | null;
  unstable_hubInfo?: Record<string, string>;
};

export interface StoredBlockInfo {
  repository: string;
  commit: string;
  distDir?: string;
  folder?: string;
  workspace?: string;
}

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
  hubInfoDirPath: string | undefined,
): string | undefined => {
  if (typeof repository === "string") {
    const repositoryUrl = hostedGitInfo
      .fromUrl(repository)
      ?.browse(hubInfoDirPath ?? "", { committish: commit });

    if (repositoryUrl) {
      return repositoryUrl;
    }

    return undefined;
  }

  const { url, directory } = repository ?? {};

  if (url) {
    const repositoryUrl = hostedGitInfo
      .fromUrl(url)
      ?.browse(hubInfoDirPath ?? directory ?? "", { committish: commit });

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
  const blockMetadataFilePaths = await globby(
    path.resolve(process.cwd(), `public/blocks/**/block-metadata.json`),
  );

  const result: ExpandedBlockMetadata[] = [];
  for (const blockMetadataFilePath of blockMetadataFilePaths) {
    const packagePath = blockMetadataFilePath
      .split("/")
      .slice(-3, -1)
      .join("/");

    const partialMetadata = await fs.readJson(blockMetadataFilePath, {
      encoding: "utf8",
    });

    const metadata: ExpandedBlockMetadata = {
      // @todo should be redundant to block's package.json#name
      componentId: `${FRONTEND_URL}/blocks/${packagePath}`,
      packagePath,
      // fallback while not all blocks have blockType defined
      blockType: partialMetadata.blockType ?? { entryPoint: "react" },
      ...partialMetadata,
    };

    const storedBlockInfo: StoredBlockInfo = await fs.readJson(
      path.resolve(process.cwd(), `../hub/${packagePath}.json`),
      { encoding: "utf8" },
    );

    const repository = getRepositoryUrl(
      metadata.repository ?? storedBlockInfo.repository,
      storedBlockInfo.commit,
      metadata.unstable_hubInfo?.directory,
    )?.replace(/\/$/, "");

    result.push({
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
      blockPackagePath: `/${metadata.packagePath.split("/").join("/blocks/")}`,
      exampleGraph: generateBlockFileUrl(
        metadata.exampleGraph,
        metadata.packagePath,
      ),
      lastUpdated: null, // TODO: derive from block data when provided by the hub
    });
  }

  return result;
};

// Blocks which are currently not compliant with the spec, and are thus misleading examples
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

/** Blocks that aren't compliant with BP V0.2  */
export const isNonV0_2Block = ({ protocol }: ExpandedBlockMetadata) => {
  return !(parseFloat(protocol) >= 0.2);
};

export const readBlockDataFromDisk = async ({
  packagePath,
  schema: metadataSchema,
  source: metadataSource,
  exampleGraph: metadataExampleGraph,
}: ExpandedBlockMetadata) => {
  // @todo update to also return the metadata information
  // @see https://github.com/blockprotocol/blockprotocol/pull/66#discussion_r784070161

  const schema = metadataSchema.startsWith(FRONTEND_URL)
    ? JSON.parse(
        await fs.readFile(
          path.resolve(
            process.cwd(),
            `public/blocks/${packagePath}/${metadataSchema.substring(
              metadataSchema.lastIndexOf("/") + 1,
            )}`,
          ),
          { encoding: "utf8" },
        ),
      )
    : await fetch(metadataSchema).then((response) => response.json());

  const source = metadataSource.startsWith(FRONTEND_URL)
    ? await fs.readFile(
        path.resolve(
          process.cwd(),
          `public/blocks/${packagePath}/${metadataSource.substring(
            metadataSource.lastIndexOf("/") + 1,
          )}`,
        ),
        { encoding: "utf8" },
      )
    : await fetch(metadataSource).then((response) => response.text());

  let exampleGraph = null;

  if (metadataExampleGraph) {
    exampleGraph = metadataExampleGraph.startsWith(FRONTEND_URL)
      ? JSON.parse(
          fs.readFileSync(
            `${process.cwd()}/public/blocks/${packagePath}/${metadataExampleGraph.substring(
              metadataExampleGraph.lastIndexOf("/") + 1,
            )}`,
            { encoding: "utf8" },
          ),
        )
      : await fetch(metadataExampleGraph).then((response) => response.json());
  }

  return {
    schema,
    source,
    exampleGraph,
  };
};

export const readBlockReadmeFromDisk = async (
  blockMetadata: ExpandedBlockMetadata,
): Promise<string | undefined> => {
  try {
    return fs.readFileSync(
      `${process.cwd()}/public/blocks/${
        blockMetadata.packagePath
      }/README.vercel-hack.md`,
      "utf8",
    );
  } catch {
    return undefined;
  }
};

import path from "node:path";

import {
  BlockMetadata,
  BlockMetadataRepository,
  JsonObject,
} from "@blockprotocol/core";
import fs from "fs-extra";
import { globby } from "globby";
import hostedGitInfo from "hosted-git-info";
import sanitize from "sanitize-html";

import { FRONTEND_URL } from "./config";

const sanitizeUrl = (url: string) => {
  const results = sanitize(`<a href="${url}" />`, {
    allowedAttributes: {
      a: ["href"],
    },
    allowedSchemes: ["http", "https"],
  });
  return results.split('"')?.[1] || "";
};

/**
 * This is the expanded block metadata that is served via the API
 * Relative file URLs are rewritten to be absolute, and other fields are added
 */
export type ExpandedBlockMetadata = BlockMetadata & {
  author: string;
  createdAt?: string | null;
  // the block's URL on blockprotocol.org
  blockSitePath: string;
  // the folder where the block's assets are stored, currently doubling up as a unique identifier for the block
  // @todo this needs rethinking when we introduce versions, as there will be multiple asset folders
  componentId: string;

  downloads?: {
    // minimum number of downloads of a block's source in the last 7 days (excludes cached results)
    weekly: number;
  };

  // an absolute URL to example-graph.json, if it exists
  exampleGraph?: string | null;
  lastUpdated?: string | null;
  npmPackageName?: string | null;
  // @[namespace]/[block-path] - unique identifier per block (across all versions)
  pathWithNamespace: string;
  // the repository URL as a string (including commit and folder info where appropriate)
  repository?: string;
  verified?: boolean;
};

/**
 * This represents the block metadata created when blocks are built from source and served from the NextJS app
 */
export type BlockMetadataOnDisk = ExpandedBlockMetadata & {
  unstable_hubInfo: {
    directory: string;
    checksum: string;
    commit: string;
    name: string;
    preparedAt: string;
  };
};

// The contents of the JSON file users provide when adding a block via PR, stored in the Hub/ folder
export interface StoredBlockInfo {
  repository: string;
  commit: string;
  distDir?: string;
  folder?: string;
  workspace?: string;
  verified?: boolean;
}

// Generate an absolute url to a block file
const generateBlockFileUrl = (
  mediaPath: string | undefined | null,
  blockDistributionFolderUrl: string,
): string | null => {
  if (!mediaPath) {
    return null;
  }
  const regex = /^(?:[a-z]+:)?\/\//i;
  if (regex.test(mediaPath)) {
    return mediaPath;
  }

  return `${blockDistributionFolderUrl}/${mediaPath.replace(/^\//, "")}`;
};

// this only runs on the server-side because hosted-git-info uses some nodejs dependencies
export const getRepositoryUrl = (
  repository: BlockMetadataRepository | undefined,
  commit?: string | undefined,
  hubInfoDirPath?: string | undefined,
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

export const expandBlockMetadata = ({
  timestamps,
  includesExampleGraph,
  metadata,
  source,
}: {
  metadata: BlockMetadata;
  source: {
    blockDistributionFolderUrl: string;
    npmPackageName?: string;
    pathWithNamespace: string;
    repository?: BlockMetadataRepository | undefined;
    repoCommit?: string;
    repoDirectory?: string;
  };
  timestamps: { createdAt?: string; lastUpdated?: string };
  includesExampleGraph: boolean;
}): ExpandedBlockMetadata => {
  const {
    blockDistributionFolderUrl,
    npmPackageName,
    pathWithNamespace,
    repository,
    repoCommit,
    repoDirectory,
  } = source;

  let repositoryUrl = getRepositoryUrl(
    repository,
    repoCommit,
    repoDirectory,
  )?.replace(/\/$/, "");

  if (repositoryUrl) {
    repositoryUrl = sanitizeUrl(repositoryUrl);
  }

  const [namespace, name] = pathWithNamespace.split("/");

  if (!namespace || !name) {
    throw new Error(`Malformed pathWithNamespace ${pathWithNamespace}`);
  }

  // eslint-disable-next-line no-param-reassign -- could make a new object, but would need to update for any new metadata fields
  delete metadata.devReloadEndpoint;

  return {
    ...metadata,
    author: namespace.replace(/^@/, ""),
    blockSitePath: `/${namespace}/blocks/${name}`,
    // fallback while not all blocks have blockType defined
    blockType: metadata.blockType ?? { entryPoint: "react" },
    // @todo figure out what we're going to use for the unique block Ids
    componentId: blockDistributionFolderUrl,
    createdAt: timestamps.createdAt,
    displayName: metadata.displayName ?? name,
    icon: generateBlockFileUrl(metadata.icon, blockDistributionFolderUrl),
    image: generateBlockFileUrl(metadata.image, blockDistributionFolderUrl),
    lastUpdated: timestamps.lastUpdated,
    name,
    npmPackageName,
    pathWithNamespace,
    protocol: metadata.protocol ?? "0.1", // assume lowest if not specified - this is a required field so should be present
    repository: repositoryUrl,
    schema: metadata.schema,
    source: generateBlockFileUrl(metadata.source, blockDistributionFolderUrl)!,
    variants: metadata.variants?.length
      ? metadata.variants?.map((variant) => ({
          ...variant,
          icon: generateBlockFileUrl(variant.icon, blockDistributionFolderUrl)!,
        }))
      : null,
    exampleGraph: generateBlockFileUrl(
      includesExampleGraph ? "example-graph.json" : null,
      blockDistributionFolderUrl,
    ),
    version: metadata.version ?? "0.0.0",
  };
};

/**
 * used to read block metadata from disk, for blocks published via JSON in hub/ and served from the public folder
 */
export const readBlocksFromDisk = async (): Promise<
  ExpandedBlockMetadata[]
> => {
  const blockMetadataFilePaths = await globby(
    path.resolve(process.cwd(), `public/blocks/**/block-metadata.json`),
  );

  const result: ExpandedBlockMetadata[] = [];
  for (const blockMetadataFilePath of blockMetadataFilePaths) {
    const metadata: BlockMetadataOnDisk = await fs.readJson(
      blockMetadataFilePath,
      {
        encoding: "utf8",
      },
    );

    result.push(metadata);
  }

  return result;
};

export const retrieveBlockFileContent = async ({
  pathWithNamespace,
  schema: metadataSchemaUrl,
  source: metadataSourceUrl,
  exampleGraph: metadataExampleGraphUrl,
}: ExpandedBlockMetadata): Promise<{
  schema: JsonObject;
  source: string;
  exampleGraph: JsonObject | null;
}> => {
  let schema = { title: "Unparseable schema" };
  try {
    schema = metadataSchemaUrl.startsWith(FRONTEND_URL)
      ? JSON.parse(
          await fs.readFile(
            path.resolve(
              process.cwd(),
              `public/blocks/${pathWithNamespace}/${metadataSchemaUrl.substring(
                metadataSchemaUrl.lastIndexOf("/") + 1,
              )}`,
            ),
            { encoding: "utf8" },
          ),
        )
      : await (
          await fetch(metadataSchemaUrl, {
            headers: { accept: "application/json" },
          })
        ).json();
  } catch (err) {
    // eslint-disable-next-line no-console -- intentional log to flag problem without tanking site
    console.error(
      `Could not fetch and parse schema at ${metadataSchemaUrl} for block ${pathWithNamespace}: ${err}`,
    );
  }

  const source = metadataSourceUrl.startsWith(FRONTEND_URL)
    ? await fs.readFile(
        path.resolve(
          process.cwd(),
          `public/blocks/${pathWithNamespace}/${metadataSourceUrl.substring(
            metadataSourceUrl.lastIndexOf("/") + 1,
          )}`,
        ),
        { encoding: "utf8" },
      )
    : await fetch(metadataSourceUrl).then((response) => response.text());

  let exampleGraph = null;

  if (metadataExampleGraphUrl) {
    exampleGraph = metadataExampleGraphUrl.startsWith(FRONTEND_URL)
      ? JSON.parse(
          fs.readFileSync(
            `${process.cwd()}/public/blocks/${pathWithNamespace}/${metadataExampleGraphUrl.substring(
              metadataExampleGraphUrl.lastIndexOf("/") + 1,
            )}`,
            { encoding: "utf8" },
          ),
        )
      : await fetch(metadataExampleGraphUrl).then((response) =>
          response.json(),
        );
  }

  return {
    schema,
    source,
    exampleGraph,
  };
};

// Retrieve the block's README.md, if any
export const retrieveBlockReadme = async (
  blockMetadata: ExpandedBlockMetadata,
): Promise<string | undefined> => {
  try {
    if (blockMetadata.componentId.includes(FRONTEND_URL)) {
      return fs.readFileSync(
        `${process.cwd()}/public/blocks/${
          blockMetadata.pathWithNamespace
        }/README.vercel-hack.md`,
        "utf8",
      );
    }

    return fetch(`${blockMetadata.componentId}/README.md`).then((resp) => {
      return resp.status === 200 ? resp.text() : undefined;
    });
  } catch {
    return undefined;
  }
};

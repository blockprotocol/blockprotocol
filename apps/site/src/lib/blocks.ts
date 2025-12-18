import {
  BlockMetadata,
  BlockMetadataRepository,
  JsonObject,
} from "@blockprotocol/core";
import hostedGitInfo from "hosted-git-info";
import sanitize from "sanitize-html";

import { BlockExampleGraph } from "../components/pages/hub/hub-utils";

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

const trustedAuthors = ["blockprotocol", "hash", "tldraw"];

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

  const author = namespace.replace(/^@/, "");

  return {
    ...metadata,
    author,
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
      ? metadata.variants.map((variant) => ({
          ...variant,
          icon: generateBlockFileUrl(
            variant.icon ?? undefined,
            blockDistributionFolderUrl,
          ),
        }))
      : null,
    exampleGraph: generateBlockFileUrl(
      includesExampleGraph ? "example-graph.json" : null,
      blockDistributionFolderUrl,
    ),
    verified: trustedAuthors.includes(author),
    version: metadata.version ?? "0.0.0",
  };
};

export const retrieveBlockFileContent = async ({
  pathWithNamespace,
  schema: metadataSchemaUrl,
  source: metadataSourceUrl,
  exampleGraph: metadataExampleGraphUrl,
}: ExpandedBlockMetadata): Promise<{
  schema: JsonObject;
  source: string;
  exampleGraph: BlockExampleGraph | null;
}> => {
  let schema = { title: "Unparseable schema" };
  try {
    schema = await (
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

  const source = await fetch(metadataSourceUrl).then((response) =>
    response.text(),
  );

  let exampleGraph = null;

  if (metadataExampleGraphUrl) {
    exampleGraph = await fetch(metadataExampleGraphUrl).then((response) =>
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
    return fetch(`${blockMetadata.componentId}/README.md`).then((resp) => {
      return resp.status === 200 ? resp.text() : undefined;
    });
  } catch {
    return undefined;
  }
};

import { BlockMetadata, BlockMetadataRepository } from "blockprotocol";
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
export const readBlocksFromDisk = (): ExpandedBlockMetadata[] => {
  /* eslint-disable global-require -- dependencies are required at runtime to avoid bundling them w/ nextjs */
  const fs = require("fs");
  const glob = require("glob");
  /* eslint-enable global-require */

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

export const readBlockDataFromDisk = async ({
  packagePath,
  schema: metadataSchema,
  source: metadataSource,
}: ExpandedBlockMetadata) => {
  /* eslint-disable global-require -- dependencies are required at runtime to avoid bundling them w/ nextjs */
  const fs = require("fs");
  // @todo update to also return the metadata information
  // @see https://github.com/blockprotocol/blockprotocol/pull/66#discussion_r784070161

  const schema = metadataSchema.startsWith("http")
    ? await fetch(metadataSchema).then((response) => response.json())
    : JSON.parse(
        fs.readFileSync(
          `${process.cwd()}/public/blocks/${packagePath}/${metadataSchema}`,
          { encoding: "utf8" },
        ),
      );

  const source = metadataSource.startsWith("http")
    ? await fetch(metadataSource).then((response) => response.text())
    : fs.readFileSync(
        `${process.cwd()}/public/blocks/${packagePath}/${metadataSource}`,
        { encoding: "utf8" },
      );

  return {
    schema,
    source,
  };
};

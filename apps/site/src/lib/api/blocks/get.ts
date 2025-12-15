import path from "node:path";

import fs from "fs-extra";

import { ExpandedBlockMetadata } from "../../blocks";
import { getDbBlock, getDbBlocks } from "./db";

const hasMongoEnv = () =>
  Boolean(process.env.MONGODB_URI) && Boolean(process.env.MONGODB_DB_NAME);

const readBlocksDataFile = async (): Promise<ExpandedBlockMetadata[]> => {
  const blocksDataPath = path.resolve(process.cwd(), "blocks-data.json");
  if (await fs.pathExists(blocksDataPath)) {
    return (await fs.readJson(blocksDataPath)) as ExpandedBlockMetadata[];
  }
  return [];
};

export const getAllBlocks = async (): Promise<ExpandedBlockMetadata[]> => {
  if (!hasMongoEnv()) {
    return readBlocksDataFile();
  }

  const allDbBlocks = await getDbBlocks({});

  // the inferred type of the JSON is incompatible with the TS type because a string union is inferred as any string
  return allDbBlocks as ExpandedBlockMetadata[];
};

export const getFeaturedBlocks = async (): Promise<ExpandedBlockMetadata[]> => {
  if (!hasMongoEnv()) {
    const allBlocks = await readBlocksDataFile();

    const featuredBlocks = [
      allBlocks.find(({ author, name }) => author === "hash" && name === "address"),
      allBlocks.find(({ author, name }) => author === "hash" && name === "how-to"),
      allBlocks.find(({ author, name }) => author === "hash" && name === "ai-image"),
    ].filter((block): block is ExpandedBlockMetadata => Boolean(block));

    return featuredBlocks;
  }

  return await Promise.all([
    getDbBlock({ author: "hash", name: "address" }),
    getDbBlock({ author: "hash", name: "how-to" }),
    getDbBlock({ author: "hash", name: "ai-image" }),
  ]).then(
    (result) => result.filter((block) => !!block) as ExpandedBlockMetadata[],
  );
};

export const getAllBlocksByUser = async (params: {
  shortname: string;
}): Promise<ExpandedBlockMetadata[]> => {
  const { shortname } = params;

  if (!hasMongoEnv()) {
    const allBlocks = await readBlocksDataFile();
    return allBlocks.filter(({ author }) => author === shortname);
  }

  const dbUserBlocks = await getDbBlocks({ shortname });

  return dbUserBlocks;
};

export const getBlockByUserAndName = async (params: {
  name: string;
  shortname: string;
}): Promise<ExpandedBlockMetadata | null> => {
  const { name, shortname } = params;

  if (!hasMongoEnv()) {
    const allBlocks = await readBlocksDataFile();
    return (
      allBlocks.find(
        (block) => block.author === shortname && block.name === name,
      ) ?? null
    );
  }

  return getDbBlock({ name, author: shortname });
};

import path from "node:path";

import fs from "fs-extra";

import { ExpandedBlockMetadata } from "../../blocks";
import { getDbBlock, getDbBlocks } from "./db";

export const getAllBlocks = async (): Promise<ExpandedBlockMetadata[]> => {
  const hasMongoEnv =
    Boolean(process.env.MONGODB_URI) && Boolean(process.env.MONGODB_DB_NAME);

  if (!hasMongoEnv) {
    const blocksDataPath = path.resolve(process.cwd(), "blocks-data.json");
    if (await fs.pathExists(blocksDataPath)) {
      return (await fs.readJson(blocksDataPath)) as ExpandedBlockMetadata[];
    }
    return [];
  }

  const allDbBlocks = await getDbBlocks({});

  // the inferred type of the JSON is incompatible with the TS type because a string union is inferred as any string
  return allDbBlocks as ExpandedBlockMetadata[];
};

export const getFeaturedBlocks = async (): Promise<ExpandedBlockMetadata[]> => {
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

  const dbUserBlocks = await getDbBlocks({ shortname });

  return dbUserBlocks;
};

export const getBlockByUserAndName = async (params: {
  name: string;
  shortname: string;
}): Promise<ExpandedBlockMetadata | null> => {
  const { name, shortname } = params;

  return getDbBlock({ name, author: shortname });
};

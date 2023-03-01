import { ExpandedBlockMetadata } from "../../blocks";
import { getDbBlock, getDbBlocks } from "./db";

export const getAllBlocks = async (): Promise<ExpandedBlockMetadata[]> => {
  const allDbBlocks = await getDbBlocks({});

  // the inferred type of the JSON is incompatible with the TS type because a string union is inferred as any string
  return allDbBlocks as ExpandedBlockMetadata[];
};

export const getFeaturedBlocks = async (): Promise<ExpandedBlockMetadata[]> => {
  return await Promise.all([
    getDbBlock({ author: "hash", name: "address" }),
    getDbBlock({ author: "hash", name: "how-to" }),
    getDbBlock({ author: "hash", name: "ai-image" }),
  ]).then((result) =>
    result.filter((block): block is ExpandedBlockMetadata => !!block),
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

import { ExpandedBlockMetadata } from "../../blocks";
import { getDbBlock, getDbBlocks } from "./db";

export const getAllBlocks = async (): Promise<ExpandedBlockMetadata[]> => {
  const allDbBlocks = await getDbBlocks({});

  // the inferred type of the JSON is incompatible with the TS type because a string union is inferred as any string
  return allDbBlocks as ExpandedBlockMetadata[];
};

const featuredBlocks = new Set([
  "@alfie/github-pr-overview",
  "@hash/code",
  "@hash/shuffle",
]);

export const getFeaturedBlocks = async (): Promise<ExpandedBlockMetadata[]> => {
  return localBlocks.filter((block) =>
    featuredBlocks.has(block.pathWithNamespace),
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

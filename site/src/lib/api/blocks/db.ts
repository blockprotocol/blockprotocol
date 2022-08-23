import { ExpandedBlockMetadata } from "../../blocks";
import { connectToDatabase } from "../mongodb";

export const blocksDbCollectionName = "bp-blocks";

const queryOptions = { projection: { _id: 0 } };

export const getDbBlocks = async (filter: { shortname?: string }) => {
  const { db } = await connectToDatabase();

  return db
    .collection<ExpandedBlockMetadata>(blocksDbCollectionName)
    .find(filter, queryOptions)
    .toArray();
};

export const getDbBlock = async ({
  name,
  shortname,
}: {
  name: string;
  shortname: string;
}) => {
  const { db } = await connectToDatabase();

  return db
    .collection<ExpandedBlockMetadata>(blocksDbCollectionName)
    .findOne({ author: shortname, name }, queryOptions);
};

export const insertDbBlock = async (block: ExpandedBlockMetadata) => {
  const { db } = await connectToDatabase();

  const { pathWithNamespace } = block;

  const existingBlock = await db
    .collection<ExpandedBlockMetadata>(blocksDbCollectionName)
    .findOne({ pathWithNamespace });
  if (existingBlock) {
    throw new Error(`Block ${pathWithNamespace} already exists`);
  }

  await db
    .collection<ExpandedBlockMetadata>(blocksDbCollectionName)
    .insertOne(block);

  return block;
};

export const updateDbBlock = async (block: ExpandedBlockMetadata) => {
  const { db } = await connectToDatabase();

  const { author, name } = block;

  const { value: updatedBlock } = await db
    .collection<ExpandedBlockMetadata>(blocksDbCollectionName)
    .findOneAndUpdate(
      { author, name },
      { $set: block },
      { returnDocument: "after", ...queryOptions },
    );

  return updatedBlock;
};

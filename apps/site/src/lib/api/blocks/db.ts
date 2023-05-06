import { ExpandedBlockMetadata } from "../../blocks";
import { connectToDatabase } from "../mongodb";
import { blocksDbCollectionName } from "./shared";

const defaultProjection = { _id: 0 };

export const getDbBlocks = async (filter: { shortname?: string }) => {
  const { db } = await connectToDatabase();

  return db
    .collection<ExpandedBlockMetadata>(blocksDbCollectionName)
    .find(filter.shortname ? { author: filter.shortname } : {}, {
      projection: defaultProjection,
    })
    .toArray();
};

export const getDbBlock = async (
  filter:
    | {
        author: string;
        name: string;
      }
    | { npmPackageName: string },
) => {
  const { db } = await connectToDatabase();

  return db
    .collection<ExpandedBlockMetadata>(blocksDbCollectionName)
    .findOne(filter, {
      projection: defaultProjection,
    });
};

export const insertDbBlock = async (block: ExpandedBlockMetadata) => {
  const { db } = await connectToDatabase();

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
      { returnDocument: "after", projection: defaultProjection },
    );

  return updatedBlock;
};

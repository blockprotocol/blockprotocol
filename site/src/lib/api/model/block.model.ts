import { Db, ObjectId, WithId } from "mongodb";

import localBlocks from "../../../../blocks-data.json" assert { type: "json" };
import { ExpandedBlockMetadata } from "../../blocks";
import { User } from "./user.model";

const BUCKET_BASE_URL =
  "https://c6499786332a3d2fb35419a7803ab7aa.r2.cloudflarestorage.com/blocks";

type BlockSourceProperties = {
  registry: "npm";
  repository: string;
};

type BlockDbProperties = {
  assetFolderPath: string;
  blockName: string;
  blockNamespace: string;
  createdAt: Date;
  lastBuiltAt: Date | null;
  metadata?: ExpandedBlockMetadata | null;
  source: BlockSourceProperties;
  updatedAt: Date;
};

export class Block {
  _id: ObjectId;
  assetFolderPath: string;
  blockName: string;
  blockNamespace: string;
  metadata?: ExpandedBlockMetadata | null;
  createdAt: Date;
  lastBuiltAt: Date | null;
  source: BlockSourceProperties;
  updatedAt: Date;

  static readonly COLLECTION_NAME = "bp-blocks";

  private constructor({
    _id,
    assetFolderPath,
    blockName,
    blockNamespace,
    metadata,
    lastBuiltAt,
    createdAt,
    updatedAt,
    source,
  }: WithId<BlockDbProperties>) {
    this._id = _id;
    this.blockName = blockName;
    this.blockNamespace = blockNamespace;
    this.source = source;

    this.assetFolderPath = assetFolderPath;
    this.metadata = metadata;
    this.lastBuiltAt = lastBuiltAt;

    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create(
    db: Db,
    params: {
      blockName: string;
      source: BlockSourceProperties;
      user: User;
    },
  ): Promise<Block> {
    const { blockName, source, user } = params;

    if (!user.shortname) {
      throw new Error(
        "User does not have a shortname. Cannot create block for user.",
      );
    }

    const blockNamespace = user.shortname;

    const assetFolderPath = `${BUCKET_BASE_URL}/${blockNamespace}/${blockName}`;

    const now = new Date();
    const block = {
      assetFolderPath,
      blockName,
      blockNamespace,
      cachedFileContent: null,
      buildStatus: "not_built" as "not_built",
      lastBuiltAt: null,
      createdAt: now,
      updatedAt: now,
      source,
    };

    const { insertedId: _id } = await db
      .collection<BlockDbProperties>(this.COLLECTION_NAME)
      .insertOne(block);

    return new Block({ _id, ...block });
  }

  static async getAll(db: Db): Promise<ExpandedBlockMetadata[]> {
    const blocksFromDb = await db
      .collection<BlockDbProperties>(this.COLLECTION_NAME)
      .find({})
      .toArray()
      .then((docs) => docs.map((doc) => new Block(doc)));

    return [...localBlocks, ...blocksFromDb];
  }

  static async getAllByUser(
    db: Db,
    params: { user: User },
  ): Promise<ExpandedBlockMetadata[]> {
    return localBlocks.filter(({ author }) => author === params.user.shortname);

    // return await db
    //   .collection<Block>(this.COLLECTION_NAME)
    //   .find(
    //     { blockNamespace: params.user.shortname },
    //     {
    //       projection: {
    //         _id: 0,
    //       },
    //     },
    //   )
    //   .toArray()
    //   .then((docs) => docs.map((doc) => new Block(doc)));
  }

  static async getByUserAndName(
    db: Db,
    params: { name: string; user: User },
  ): Promise<ExpandedBlockMetadata | null> {
    const {
      name,
      user: { shortname },
    } = params;
    return localBlocks.filter(
      ({ packagePath }) => packagePath === `@${shortname}/${name}`,
    );

    // const block = await db
    //   .collection<BlockDbProperties>(this.COLLECTION_NAME)
    //   .findOne(
    //     { blockName: params.name, blockNamespace: params.user.shortname },
    //     {
    //       projection: {
    //         _id: 0,
    //       },
    //     },
    //   );
    //
    // return block ? new Block(block) : null;
  }

  async update(
    db: Db,
    params: { source?: BlockSourceProperties },
  ): Promise<Block> {
    const { source } = params;

    const now = new Date();

    const { value: updatedBlock } = await db
      .collection<Block>(Block.COLLECTION_NAME)
      .findOneAndUpdate(
        { blockName: this.blockName, blockNamespace: this.blockNamespace },
        {
          $set: {
            source: source ?? undefined,
            updatedAt: now,
          },
        },
        { returnDocument: "after" },
      );

    if (!updatedBlock) {
      throw new Error(
        "Critical: could not find record of Block instance in database.",
      );
    }

    return new Block(updatedBlock);
  }
}

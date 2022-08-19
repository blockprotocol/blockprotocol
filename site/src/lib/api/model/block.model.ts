import { BlockVariant, JsonObject } from "@blockprotocol/core";
import { BlockType } from "@blockprotocol/core/dist/esm/types";
import { Db } from "mongodb";

import localBlocks from "../../../../blocks-data.json" assert { type: "json" };
import { ExpandedBlockMetadata } from "../../blocks";
import { User } from "./user.model";

export class Block implements ExpandedBlockMetadata {
  author?: string | null;
  blockType: BlockType;
  blockSitePath: string;
  componentId: string;
  default?: JsonObject | null;
  description?: string | null;
  displayName?: string | null;
  examples?: JsonObject[] | null;
  exampleGraph?: string | null;
  externals?: JsonObject;
  icon?: string | null;
  image?: string | null;
  lastUpdated?: string | null;
  license?: string | null;
  name: string;
  npmPackageName?: string | null;
  pathWithNamespace: string;
  protocol: string;
  repository?: string;
  schema: string;
  source: string;
  variants?: BlockVariant[] | null;
  version: string;
  createdAt?: Date;

  static readonly COLLECTION_NAME = "bp-blocks";

  private constructor(metadata: ExpandedBlockMetadata) {
    this.author = metadata.author;
    this.blockType = metadata.blockType;
    this.blockSitePath = metadata.blockSitePath;
    this.componentId = metadata.componentId;
    this.default = metadata.default;
    this.description = metadata.description;
    this.displayName = metadata.displayName;
    this.examples = metadata.examples;
    this.exampleGraph = metadata.exampleGraph;
    this.externals = metadata.externals;
    this.icon = metadata.icon;
    this.image = metadata.image;
    this.lastUpdated = metadata.lastUpdated;
    this.license = metadata.license;
    this.name = metadata.name;
    this.npmPackageName = metadata.npmPackageName;
    this.pathWithNamespace = metadata.pathWithNamespace;
    this.protocol = metadata.protocol;
    this.repository = metadata.repository;
    this.schema = metadata.schema;
    this.source = metadata.source;
    this.variants = metadata.variants;
    this.version = metadata.version;
    this.createdAt = metadata.createdAt;
  }

  static async getAll(_db: Db): Promise<ExpandedBlockMetadata[]> {
    // const blocksFromDb = await db
    //   .collection<BlockDbProperties>(this.COLLECTION_NAME)
    //   .find({})
    //   .toArray()
    //   .then((docs) => docs.map((doc) => new Block(doc)));

    // the inferred type of the JSON is incompatible with the TS type because a string union is inferred as any string
    return localBlocks as ExpandedBlockMetadata[];
  }

  static async getAllByUser(
    db: Db,
    params: { user: User },
  ): Promise<ExpandedBlockMetadata[]> {
    // the inferred type of the JSON is incompatible with the TS type because a string union is inferred as any string
    return localBlocks.filter(
      ({ author }) => author === params.user.shortname,
    ) as ExpandedBlockMetadata[];

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
    // the inferred type of the JSON is incompatible with the TS type because a string union is inferred as any string
    return (localBlocks.filter(
      ({ pathWithNamespace }) => pathWithNamespace === `@${shortname}/${name}`,
    )?.[0] ?? null) as ExpandedBlockMetadata | null;

    // const block = await db
    //   .collection<BlockDbProperties>(this.COLLECTION_ NAME)
    //   .fin dOne(
    //     { blockName: params.name, blockNamespace: params.user.shortna me },
    //     {
    //       projecti on: {
    //         _i d: 0,
    //       },
    //     },
    //   );
    //
    // return block ? new Block(block) : null;
  }
}

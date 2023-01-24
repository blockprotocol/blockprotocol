import { Entity } from "@blockprotocol/graph";

/**
 * This file was automatically generated – do not edit it.
 * @see https://alpha.hash.ai/@hash/types/entity-type/page/v/1 for the root JSON Schema these types were generated from
 * Types for link entities and their destination were generated to a depth of 2 from the root
 */

/**
 * Whether or not something has been archived.
 */
export type Archived = Boolean;
/**
 * A True or False value
 */
export type Boolean = boolean;
/**
 * The title of something.
 */
export type Title = Text;
/**
 * An ordered sequence of characters
 */
export type Text = string;
/**
 * The summary of the something.
 */
export type Summary = Text;
/**
 * The (fractional) index indicating the current position of something.
 */
export type Index = Text;
/**
 * An emoji icon.
 */
export type Icon = Text;

export type PageProperties = {
  "https://alpha.hash.ai/@hash/types/property-type/archived/"?: Archived;
  "https://alpha.hash.ai/@hash/types/property-type/title/": Title;
  "https://alpha.hash.ai/@hash/types/property-type/summary/"?: Summary;
  "https://alpha.hash.ai/@hash/types/property-type/index/": Index;
  "https://alpha.hash.ai/@hash/types/property-type/icon/"?: Icon;
}

export type Page = Entity<PageProperties>;

/**
 * The parent of something.
 */
export type ParentProperties = ParentProperties1 & ParentProperties2;
export type ParentProperties1 = Link;

export type Link = {
  leftEntityId?: string;
  rightEntityId?: string;
}
export type ParentProperties2 = {}

export type Parent = Entity<ParentProperties>;
export type ParentLinksByLinkTypeId = {

};

export type ParentLinkAndRightEntities = NonNullable<
  ParentLinksByLinkTypeId[keyof ParentLinksByLinkTypeId]
>;

export type PageParentLinks = [] |
  {
    linkEntity: Parent;
    rightEntity: Page;
  }[];


/**
 * Something containing something.
 */
export type ContainsProperties = ContainsProperties1 & ContainsProperties2;
export type ContainsProperties1 = Link;


export type ContainsProperties2 = {}

export type Contains = Entity<ContainsProperties>;
export type ContainsLinksByLinkTypeId = {

};

export type ContainsLinkAndRightEntities = NonNullable<
  ContainsLinksByLinkTypeId[keyof ContainsLinksByLinkTypeId]
>;
export type ComponentId = Text;
/**
 * An ordered sequence of characters
 */


export type BlockProperties = {
  "https://alpha.hash.ai/@hash/types/property-type/component-id/": ComponentId;
}

export type Block = Entity<BlockProperties>;

/**
 * The entity representing the data in a block.
 */
export type BlockDataProperties = BlockDataProperties1 & BlockDataProperties2;
export type BlockDataProperties1 = Link;


export type BlockDataProperties2 = {}

export type BlockData = Entity<BlockDataProperties>;

export type BlockBlockDataLinks = [] |
  {
    linkEntity: BlockData;
    rightEntity: Entity;
  }[];

export type BlockLinksByLinkTypeId = {
  "https://alpha.hash.ai/@hash/types/entity-type/block-data/v/1": BlockBlockDataLinks;
};

export type BlockLinkAndRightEntities = NonNullable<
  BlockLinksByLinkTypeId[keyof BlockLinksByLinkTypeId]
>;
export type PageContainsLinks = [] |
  {
    linkEntity: Contains;
    rightEntity: Block;
  }[];

export type PageLinksByLinkTypeId = {
  "https://alpha.hash.ai/@hash/types/entity-type/parent/v/1": PageParentLinks;
  "https://alpha.hash.ai/@hash/types/entity-type/contains/v/1": PageContainsLinks;
};

export type PageLinkAndRightEntities = NonNullable<
  PageLinksByLinkTypeId[keyof PageLinksByLinkTypeId]
>;

export type RootEntity = Page;
export type RootEntityLinkedEntities = PageLinkAndRightEntities;
export type RootLinkMap = PageLinksByLinkTypeId;
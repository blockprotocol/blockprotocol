import { Entity, JsonObject } from "@blockprotocol/graph";

/**
 * This file was automatically generated – do not edit it.
 * @see https://blockprotocol-hhh1orwc8.stage.hash.ai/@alfie/types/entity-type/complicated/v/3 for the root JSON Schema these types were generated from
 * Types for link entities and their destination were generated to a depth of 2 from the root
 */

/**
 * The name of something
 */
export type Name = Text;
/**
 * An ordered sequence of characters
 */
export type Text = string;
/**
 * Complicated property type
 */
export type Complicated =
  | {
      "https://blockprotocol-r2l2zq4gf.stage.hash.ai/@blockprotocol/types/property-type/name/": Name;
      "https://blockprotocol-pktjfgq1m.stage.hash.ai/@blockprotocol/types/property-type/content/"?: Content[];
      "https://blockprotocol-ae37rxcaw.stage.hash.ai/@nate/types/property-type/pause-duration/"?: PauseDuration;
    }
  | Number;
/**
 * Textual content
 */
export type Content = Text;
/**
 * The duration of a pause
 */
export type PauseDuration = Text;
/**
 * An arithmetical value (in the Real number system)
 */
export type Number = number;

/**
 * Some description
 */
export type ComplicatedProperties = {
  "https://blockprotocol-r2l2zq4gf.stage.hash.ai/@blockprotocol/types/property-type/name/"?: Name;
  "https://blockprotocol-hhh1orwc8.stage.hash.ai/@alfie/types/property-type/complicated/"?: Complicated;
}

export type Complicated = Entity<ComplicatedProperties>;

/**
 * A link
 */
export type LinkProperties = LinkProperties1 & LinkProperties2;
export type LinkProperties1 = Link;

export type Link = {
  leftEntityId?: string;
  rightEntityId?: string;
}
export type Link =Properties2 {}

export type 1Link = Entity<1LinkProperties>;
export type 1LinkLinksByLinkTypeId = {

};

export type 1LinkLinkAndRightEntities = NonNullable<
  1LinkLinksByLinkTypeId[keyof 1LinkLinksByLinkTypeId]
>;
/**
 * Some description
 */
export type ComplicatedV1Properties = {}

export type ComplicatedV1 = Entity<ComplicatedV1Properties>;
export type ComplicatedV1LinksByLinkTypeId = {

};

export type ComplicatedV1LinkAndRightEntities = NonNullable<
  ComplicatedV1LinksByLinkTypeId[keyof ComplicatedV1LinksByLinkTypeId]
>;
export type Complicated1LinkLinks = [] |
  {
    linkEntity: 1Link;
    rightEntity: ComplicatedV1;
  }[];


/**
 * Another link
 */
export type Link2Properties = Link2Properties1 & Link2Properties2;
export type Link2Properties1 = Link;


export type Link2Properties2 = {}

export type Link2 = Entity<Link2Properties>;
export type Link2LinksByLinkTypeId = {

};

export type Link2LinkAndRightEntities = NonNullable<
  Link2LinksByLinkTypeId[keyof Link2LinksByLinkTypeId]
>;
export type ComplicatedLink2Links = [] |
  {
    linkEntity: Link2;
    rightEntity: Entity;
  }[];


/**
 * A complicated link
 */
export type LinkSProperties = LinkSProperties1 & LinkSProperties2;
export type LinkSProperties1 = Link;


export type Link =SProperties2 {}

export type Link's = Entity<Link'sProperties>;
export type Link'sLinksByLinkTypeId = {

};

export type Link'sLinkAndRightEntities = NonNullable<
  Link'sLinksByLinkTypeId[keyof Link'sLinksByLinkTypeId]
>;
/**
 * A word or set of words by which something is known, addressed, or referred to
 */

/**
 * An ordered sequence of characters
 */

/**
 * A URL linking to a given website
 */
export type Website = Text;

/**
 * A group of entities (people, companies, etc.) focused on a common purpose
 */
export type OrganizationProperties = {
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/name/"?: Name;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/website/"?: Website;
}

export type Organization = Entity<OrganizationProperties>;

/**
 * Established, initiated, or created by this entity.
 */
export type FoundedbyProperties = FoundedbyProperties1 & FoundedbyProperties2;
export type FoundedbyProperties1 = Link;


export type FoundedbyProperties2 = {}

export type Foundedby = Entity<FoundedbyProperties>;

/**
 * A word or set of words by which something is known, addressed, or referred to
 */

/**
 * An ordered sequence of characters
 */

/**
 * A URL linking to a given website
 */

/**
 * A URL that contains an image associated with a user, person, character, or persona
 */
export type Avatar = Text;
/**
 * An e-mail address
 */
export type EMail = Text;

/**
 * A human being or individual
 */
export type PersonProperties = {
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/name/"?: Name;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/website/"?: Website;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/avatar/"?: Avatar;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/e-mail/"?: EMail;
}

export type Person = Entity<PersonProperties>;

export type OrganizationFoundedbyLinks = [] |
  {
    linkEntity: Foundedby;
    rightEntity: Person;
  }[];

export type OrganizationLinksByLinkTypeId = {
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/founded-by/v/1": OrganizationFoundedbyLinks;
};

export type OrganizationLinkAndRightEntities = NonNullable<
  OrganizationLinksByLinkTypeId[keyof OrganizationLinksByLinkTypeId]
>;
export type ComplicatedLink'sLinks = [] |
  {
    linkEntity: Link's;
    rightEntity: Organization;
  }[];

export type ComplicatedLinksByLinkTypeId = {
  "https://blockprotocol-hhh1orwc8.stage.hash.ai/@alfie/types/entity-type/1-link/v/1": Complicated1LinkLinks;
  "https://blockprotocol-hhh1orwc8.stage.hash.ai/@alfie/types/entity-type/link-2/v/1": ComplicatedLink2Links;
  "https://blockprotocol-hhh1orwc8.stage.hash.ai/@alfie/types/entity-type/links/v/1": ComplicatedLink'sLinks;
};

export type ComplicatedLinkAndRightEntities = NonNullable<
  ComplicatedLinksByLinkTypeId[keyof ComplicatedLinksByLinkTypeId]
>;

export type RootEntity = Complicated;
export type RootEntityLinkedEntities = ComplicatedLinkAndRightEntities;
export type RootLinkMap = ComplicatedLinksByLinkTypeId;
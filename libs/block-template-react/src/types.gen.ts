import { Entity, JsonObject } from "@blockprotocol/graph";

/**
 * This file was automatically generated – do not edit it.
 * @see https://blockprotocol-hhh1orwc8.stage.hash.ai/@alfie/types/entity-type/complicated/v/4 for the root JSON Schema these types were generated from
 * Types for link entities and their destination were generated to a depth of 2 from the root
 */

/**
 * The name of something
 */
export type NamePropertyValue = TextDataValue;
/**
 * An ordered sequence of characters
 */
export type TextDataValue = string;
/**
 * Complicated property type
 */
export type ComplicatedPropertyValue =
  | {
      "https://blockprotocol-r2l2zq4gf.stage.hash.ai/@blockprotocol/types/property-type/name/": NamePropertyValue;
      "https://blockprotocol-pktjfgq1m.stage.hash.ai/@blockprotocol/types/property-type/content/"?: ContentPropertyValue[];
      "https://blockprotocol-ae37rxcaw.stage.hash.ai/@nate/types/property-type/pause-duration/"?: PauseDurationPropertyValue;
    }
  | NumberDataValue;
/**
 * Textual content
 */
export type ContentPropertyValue = TextDataValue;
/**
 * The duration of a pause
 */
export type PauseDurationPropertyValue = TextDataValue;
/**
 * An arithmetical value (in the Real number system)
 */
export type NumberDataValue = number;
/**
 * awd
 */
export type PrimitiveObjectPropertyPropertyValue = ObjectDataValue;

/**
 * Some description
 */
export type ComplicatedProperties = {
  "https://blockprotocol-r2l2zq4gf.stage.hash.ai/@blockprotocol/types/property-type/name/"?: NamePropertyValue;
  "https://blockprotocol-hhh1orwc8.stage.hash.ai/@alfie/types/property-type/complicated/"?: ComplicatedPropertyValue;
  "https://blockprotocol-hhh1orwc8.stage.hash.ai/@alfie/types/property-type/primitive-object-property/"?: PrimitiveObjectPropertyPropertyValue;
}
/**
 * An opaque, untyped JSON object
 */
export interface ObjectDataValue {}

export type Complicated = Entity<ComplicatedProperties>;

/**
 * A link
 */
export type T1LinkProperties = {}

export type T1Link = Entity<T1LinkProperties>;
export type T1LinkLinksByLinkTypeId = {

};

export type T1LinkLinkAndRightEntities = NonNullable<
  T1LinkLinksByLinkTypeId[keyof T1LinkLinksByLinkTypeId]
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
export type ComplicatedT1LinkLinks = [] |
  {
    linkEntity: T1Link;
    rightEntity: ComplicatedV1;
  }[];


/**
 * Another link
 */
export type Link2Properties = {}

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
export type LinkSProperties = {}

export type LinkS = Entity<LinkSProperties>;
export type LinkSLinksByLinkTypeId = {

};

export type LinkSLinkAndRightEntities = NonNullable<
  LinkSLinksByLinkTypeId[keyof LinkSLinksByLinkTypeId]
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
export type WebsitePropertyValue = TextDataValue;

/**
 * A group of entities (people, companies, etc.) focused on a common purpose
 */
export type OrganizationProperties = {
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/name/"?: NamePropertyValue;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/website/"?: WebsitePropertyValue;
}

export type Organization = Entity<OrganizationProperties>;

/**
 * Established, initiated, or created by this entity.
 */
export type FoundedByProperties = {}

export type FoundedBy = Entity<FoundedByProperties>;

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
export type AvatarPropertyValue = TextDataValue;
/**
 * An e-mail address
 */
export type EMailPropertyValue = TextDataValue;

/**
 * A human being or individual
 */
export type PersonProperties = {
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/name/"?: NamePropertyValue;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/website/"?: WebsitePropertyValue;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/avatar/"?: AvatarPropertyValue;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/e-mail/"?: EMailPropertyValue;
}

export type Person = Entity<PersonProperties>;

export type OrganizationFoundedByLinks = [] |
  {
    linkEntity: FoundedBy;
    rightEntity: Person;
  }[];

export type OrganizationLinksByLinkTypeId = {
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/founded-by/v/1": OrganizationFoundedByLinks;
};

export type OrganizationLinkAndRightEntities = NonNullable<
  OrganizationLinksByLinkTypeId[keyof OrganizationLinksByLinkTypeId]
>;
export type ComplicatedLinkSLinks = [] |
  {
    linkEntity: LinkS;
    rightEntity: Organization;
  }[];

export type ComplicatedLinksByLinkTypeId = {
  "https://blockprotocol-hhh1orwc8.stage.hash.ai/@alfie/types/entity-type/1-link/v/1": ComplicatedT1LinkLinks;
  "https://blockprotocol-hhh1orwc8.stage.hash.ai/@alfie/types/entity-type/link-2/v/1": ComplicatedLink2Links;
  "https://blockprotocol-hhh1orwc8.stage.hash.ai/@alfie/types/entity-type/links/v/1": ComplicatedLinkSLinks;
};

export type ComplicatedLinkAndRightEntities = NonNullable<
  ComplicatedLinksByLinkTypeId[keyof ComplicatedLinksByLinkTypeId]
>;

export type RootEntity = Complicated;
export type RootEntityLinkedEntities = ComplicatedLinkAndRightEntities;
export type RootLinkMap = ComplicatedLinksByLinkTypeId;
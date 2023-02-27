import { Entity, JsonObject } from "@blockprotocol/graph";

/**
 * This file was automatically generated – do not edit it.
 * @see https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/person/v/3 for the root JSON Schema these types were generated from
 * Types for link entities and their destination were generated to a depth of 2 from the root
 */

/**
 * A word or set of words by which something is known, addressed, or referred to
 */
export type NamePropertyValue = TextDataValue;
/**
 * An ordered sequence of characters
 */
export type TextDataValue = string;
/**
 * A URL linking to a given website
 */
export type WebsitePropertyValue = TextDataValue;
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

/**
 * In employment of this entity.
 */
export type EmployedByProperties = {}

export type EmployedBy = Entity<EmployedByProperties>;
export type EmployedByLinksByLinkTypeId = {

};

export type EmployedByLinkAndRightEntities = NonNullable<
  EmployedByLinksByLinkTypeId[keyof EmployedByLinksByLinkTypeId]
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

/**
 * An e-mail address
 */


/**
 * A human being or individual
 */
export type PersonV2Properties = {
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/name/"?: NamePropertyValue;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/website/"?: WebsitePropertyValue;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/avatar/"?: AvatarPropertyValue;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/e-mail/"?: EMailPropertyValue;
}

export type PersonV2 = Entity<PersonV2Properties>;

export type OrganizationFoundedByLinks = [] |
  {
    linkEntity: FoundedBy;
    rightEntity: PersonV2;
  }[];

export type OrganizationLinksByLinkTypeId = {
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/founded-by/v/1": OrganizationFoundedByLinks;
};

export type OrganizationLinkAndRightEntities = NonNullable<
  OrganizationLinksByLinkTypeId[keyof OrganizationLinksByLinkTypeId]
>;
export type PersonEmployedByLinks = [] |
  {
    linkEntity: EmployedBy;
    rightEntity: Organization;
  }[];

export type PersonLinksByLinkTypeId = {
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/employed-by/v/1": PersonEmployedByLinks;
};

export type PersonLinkAndRightEntities = NonNullable<
  PersonLinksByLinkTypeId[keyof PersonLinksByLinkTypeId]
>;

export type RootEntity = Person;
export type RootEntityLinkedEntities = PersonLinkAndRightEntities;
export type RootLinkMap = PersonLinksByLinkTypeId;
import { Entity, JsonObject } from "@blockprotocol/graph";

/**
 * This file was automatically generated – do not edit it.
 * @see https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/organization/v/2 for the root JSON Schema these types were generated from
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
export type FoundedByLinksByLinkTypeId = {

};

export type FoundedByLinkAndRightEntities = NonNullable<
  FoundedByLinksByLinkTypeId[keyof FoundedByLinksByLinkTypeId]
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
export type PersonLinksByLinkTypeId = {

};

export type PersonLinkAndRightEntities = NonNullable<
  PersonLinksByLinkTypeId[keyof PersonLinksByLinkTypeId]
>;
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

export type RootEntity = Organization;
export type RootEntityLinkedEntities = OrganizationLinkAndRightEntities;
export type RootLinkMap = OrganizationLinksByLinkTypeId;
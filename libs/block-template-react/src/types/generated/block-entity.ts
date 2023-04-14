/**
 * This file was automatically generated – do not edit it.
 */

import { Entity, LinkData } from "@blockprotocol/graph";

/**
 * A URL that contains an image associated with a user, person, character, or persona
 */
export type AvatarPropertyValue = Text;

export type BlockEntity = Thing;

export type BlockEntityOutgoingLinkAndTarget = ThingOutgoingLinkAndTarget;

/**
 * An e-mail address
 */
export type EMailPropertyValue = Text;

export type EmployedBy = Entity<EmployedByProperties> & { linkData: LinkData };

export type EmployedByOutgoingLinkAndTarget = never;

export type EmployedByOutgoingLinksByLinkEntityTypeId = {};

/**
 * In employment of this entity.
 */
export type EmployedByProperties = EmployedByProperties1 &
  EmployedByProperties2;
export type EmployedByProperties1 = LinkProperties;

export type EmployedByProperties2 = {};

export type FoundedBy = Entity<FoundedByProperties> & { linkData: LinkData };

export type FoundedByOutgoingLinkAndTarget = never;

export type FoundedByOutgoingLinksByLinkEntityTypeId = {};

/**
 * Established, initiated, or created by this entity.
 */
export type FoundedByProperties = FoundedByProperties1 & FoundedByProperties2;
export type FoundedByProperties1 = LinkProperties;

export type FoundedByProperties2 = {};

export type Link = Entity<LinkProperties>;

export type LinkOutgoingLinkAndTarget = never;

export type LinkOutgoingLinksByLinkEntityTypeId = {};

export type LinkProperties = {};

/**
 * A word or set of words by which something is known, addressed, or referred to
 */
export type Name0PropertyValue = Text;

/**
 * A word or set of words by which something is known, addressed, or referred to.
 */
export type Name1PropertyValue = Text;

export type Organization = Entity<OrganizationProperties>;

export type OrganizationFoundedByLinks = {
  linkEntity: FoundedBy;
  rightEntity: PersonV2;
};

export type OrganizationOutgoingLinkAndTarget = OrganizationFoundedByLinks;

export type OrganizationOutgoingLinksByLinkEntityTypeId = {
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/founded-by/v/1": OrganizationFoundedByLinks;
};

/**
 * A group of entities (people, companies, etc.) focused on a common purpose
 */
export type OrganizationProperties = {
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/name/"?: Name0PropertyValue;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/website/"?: WebsitePropertyValue;
};

export type PersonV2 = Entity<PersonV2Properties>;

export type PersonV2OutgoingLinkAndTarget = never;

export type PersonV2OutgoingLinksByLinkEntityTypeId = {};

/**
 * A human being or individual
 */
export type PersonV2Properties = {
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/name/"?: Name0PropertyValue;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/website/"?: WebsitePropertyValue;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/avatar/"?: AvatarPropertyValue;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/e-mail/"?: EMailPropertyValue;
};

export type PersonV3 = Entity<PersonV3Properties>;

export type PersonV3EmployedByLinks = {
  linkEntity: EmployedBy;
  rightEntity: Organization;
};

export type PersonV3OutgoingLinkAndTarget = PersonV3EmployedByLinks;

export type PersonV3OutgoingLinksByLinkEntityTypeId = {
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/employed-by/v/1": PersonV3EmployedByLinks;
};

/**
 * A human being or individual
 */
export type PersonV3Properties = {
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/name/"?: Name0PropertyValue;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/website/"?: WebsitePropertyValue;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/avatar/"?: AvatarPropertyValue;
  "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/e-mail/"?: EMailPropertyValue;
};

/**
 * An ordered sequence of characters
 */
export type Text = string;

export type Thing = Entity<ThingProperties>;

export type ThingOutgoingLinkAndTarget = never;

export type ThingOutgoingLinksByLinkEntityTypeId = {};

/**
 * A generic thing
 */
export type ThingProperties = {
  "https://blockprotocol.org/@blockprotocol/types/property-type/name/"?: Name1PropertyValue;
};

/**
 * A URL linking to a given website
 */
export type WebsitePropertyValue = Text;

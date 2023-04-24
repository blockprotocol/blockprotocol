/**
 * This file was automatically generated – do not edit it.
 */

import { Entity, LinkData } from "@blockprotocol/graph";

export type Company = Entity<CompanyProperties>;

export type CompanyFoundedByLink = {
  linkEntity: FoundedBy;
  rightEntity: Person;
};

export type CompanyOutgoingLinkAndTarget = CompanyFoundedByLink;

export type CompanyOutgoingLinksByLinkEntityTypeId = {
  "https://blockprotocol.org/@examples/types/entity-type/founded-by/v/1": CompanyFoundedByLink;
};

/**
 * An extremely simplified representation of a corporate organization.
 */
export type CompanyProperties = {
  "https://blockprotocol.org/@blockprotocol/types/property-type/name/": NamePropertyValue;
};

/**
 * An e-mail address.
 */
export type EMailPropertyValue = Text;

export type EmployedBy = Entity<EmployedByProperties> & { linkData: LinkData };

export type EmployedByOutgoingLinkAndTarget = never;

export type EmployedByOutgoingLinksByLinkEntityTypeId = {};

/**
 * Being paid to work for this entity.
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
 * A word or set of words by which something is known, addressed, or referred to.
 */
export type NamePropertyValue = Text;

export type Person = Entity<PersonProperties>;

export type PersonEmployedByLink = {
  linkEntity: EmployedBy;
  rightEntity: Company;
};

export type PersonOutgoingLinkAndTarget = PersonEmployedByLink;

export type PersonOutgoingLinksByLinkEntityTypeId = {
  "https://blockprotocol.org/@examples/types/entity-type/employed-by/v/1": PersonEmployedByLink;
};

/**
 * An extremely simplified representation of a person or human being.
 */
export type PersonProperties = {
  "https://blockprotocol.org/@blockprotocol/types/property-type/name/": NamePropertyValue;
  "https://blockprotocol.org/@examples/types/property-type/e-mail/"?: EMailPropertyValue;
};

/**
 * An ordered sequence of characters
 */
export type Text = string;

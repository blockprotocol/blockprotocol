/**
 * This file was automatically generated – do not edit it.
 */

import { Entity } from "@blockprotocol/graph";

/**
 * A word or set of words by which something is known, addressed, or referred to.
 */
export type NamePropertyValue = Text;

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
  "https://blockprotocol.org/@blockprotocol/types/property-type/name/"?: NamePropertyValue;
};

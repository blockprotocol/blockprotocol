/**
 * This file was automatically generated – do not edit it.
 * See the respective URLs for the Block Protocol Types this was generated from.
 */

import { Entity } from "@blockprotocol/graph";

export type BlockEntity = Thing;

export type BlockEntityOutgoingLinksAndTargets = ThingOutgoingLinksAndTargets;

/**
 * A word or set of words by which something is known, addressed, or referred to.
 */
export type NamePropertyValue = Text;

/**
 * An ordered sequence of characters
 */
export type Text = string;

export type Thing = Entity<ThingProperties>;

export type ThingOutgoingLinksAndTargets = never;

export type ThingOutgoingLinksByLinkEntityTypeId = {};

/**
 * A generic thing
 */
export type ThingProperties = {
  "https://blockprotocol.org/@blockprotocol/types/property-type/name/"?: NamePropertyValue;
};

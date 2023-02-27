/**
 * This file was automatically generated – do not edit it.
 */

import { Entity } from "@blockprotocol/graph";

import { NamePropertyValue, Text } from "./shared";

export type { NamePropertyValue, Text };

export type BlockEntity = Thing;

export type BlockEntityOutgoingLinkAndTarget = ThingOutgoingLinkAndTarget;

export type Thing = Entity<ThingProperties>;

export type ThingOutgoingLinkAndTarget = never;

export type ThingOutgoingLinksByLinkEntityTypeId = {};

/**
 * A generic thing
 */
export type ThingProperties = {
  "https://blockprotocol.org/@blockprotocol/types/property-type/name/"?: NamePropertyValue;
};

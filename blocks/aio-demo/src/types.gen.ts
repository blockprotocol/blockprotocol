import { Entity, JsonObject } from "@blockprotocol/graph";

/**
 * This file was automatically generated – do not edit it.
 * @see https://blockprotocol.org/@blockprotocol/types/entity-type/thing/v/2 for the root JSON Schema these types were generated from
 * Types for link entities and their destination were generated to a depth of 2 from the root
 */

/**
 * A word or set of words by which something is known, addressed, or referred to.
 */
export type NamePropertyValue = TextDataValue;
/**
 * An ordered sequence of characters
 */
export type TextDataValue = string;

/**
 * A generic thing
 */
export type ThingProperties = {
  "https://blockprotocol.org/@blockprotocol/types/property-type/name/"?: NamePropertyValue;
}

export type Thing = Entity<ThingProperties>;
export type ThingLinksByLinkTypeId = {

};

export type ThingLinkAndRightEntities = NonNullable<
  ThingLinksByLinkTypeId[keyof ThingLinksByLinkTypeId]
>;

export type RootEntity = Thing;
export type RootEntityLinkedEntities = ThingLinkAndRightEntities;
export type RootLinkMap = ThingLinksByLinkTypeId;
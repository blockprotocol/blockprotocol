/**
 * This file was automatically generated – do not edit it.
 * See the respective URLs for the Block Protocol Types this was generated from.
 */

import { Entity, LinkData } from "@blockprotocol/graph"

import { LinkProperties, ShuffleBlock, ShuffleBlockProperties, Text, TextualContentPropertyValue } from "./shared"

export type { LinkProperties, ShuffleBlock, ShuffleBlockProperties, Text, TextualContentPropertyValue }



export type BlockEntity = ShuffleBlock



export type HasRepresentativeShuffleBlockItem = Entity<HasRepresentativeShuffleBlockItemProperties> & { linkData: LinkData }


/**
 * A link to an arbitrary entity which has an associated representation as a Shuffle Block Item
 */
export type HasRepresentativeShuffleBlockItemProperties = (HasRepresentativeShuffleBlockItemProperties1 & HasRepresentativeShuffleBlockItemProperties2)
export type HasRepresentativeShuffleBlockItemProperties1 = LinkProperties


export type HasRepresentativeShuffleBlockItemProperties2 = {

}


/**
 * The EntityId of the “Has Representative Shuffle Block Item” link entity associated with this item.
 */
export type ShuffleBlockItemAssociatedLinkEntityIDPropertyValue = Text



/**
 * A unique identifier for a Shuffle Block item, used to keep track as the item is shuffled.
 */
export type ShuffleBlockItemIDPropertyValue = Text



/**
 * An item within the Shuffle Block random list, the contents of which may be a string, or some representation of another entity.
 */
export type ShuffleBlockItemPropertyValue = {
"https://blockprotocol.org/@blockprotocol/types/property-type/textual-content/"?: TextualContentPropertyValue
"https://blockprotocol.org/@hash/types/property-type/shuffle-block-item-id/": ShuffleBlockItemIDPropertyValue
"https://blockprotocol.org/@hash/types/property-type/shuffle-block-item-associated-link-entity-id/"?: ShuffleBlockItemAssociatedLinkEntityIDPropertyValue
}





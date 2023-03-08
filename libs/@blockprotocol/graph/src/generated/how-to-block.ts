/**
 * This file was automatically generated – do not edit it.
 * See the respective URLs for the Block Protocol Types this was generated from.
 */

import { Entity, LinkData } from "@blockprotocol/graph"

import { DescriptionPropertyValue, HowToBlock, HowToBlockProperties, LinkProperties, Text, TitlePropertyValue } from "./shared"

export type { DescriptionPropertyValue, HowToBlock, HowToBlockProperties, LinkProperties, Text, TitlePropertyValue }



export type BlockEntity = HowToBlock



export type HasHowToBlockIntroduction = Entity<HasHowToBlockIntroductionProperties> & { linkData: LinkData }


/**
 * Contains a How-To Block Introduction
 * 
 * See: https://blockprotocol.org/@hash/types/entity-type/how-to-block-introduction
 */
export type HasHowToBlockIntroductionProperties = (HasHowToBlockIntroductionProperties1 & HasHowToBlockIntroductionProperties2)
export type HasHowToBlockIntroductionProperties1 = LinkProperties


export type HasHowToBlockIntroductionProperties2 = {

}



export type HasHowToBlockStep = Entity<HasHowToBlockStepProperties> & { linkData: LinkData }


/**
 * Contains a How-To Block step.
 * 
 * See: https://blockprotocol.org/@hash/types/entity-type/how-to-block-step
 */
export type HasHowToBlockStepProperties = (HasHowToBlockStepProperties1 & HasHowToBlockStepProperties2)
export type HasHowToBlockStepProperties1 = LinkProperties


export type HasHowToBlockStepProperties2 = {

}



export type HowToBlockIntroduction = Entity<HowToBlockIntroductionProperties>





/**
 * A short description or precursor that explains the process that’s defined within the How-To block, or defines any preliminary context.
 * 
 * It also often describes any pre-requisites necessary for completing the subsequent set of “How-To Block Step”s.
 * 
 * See: https://blockprotocol.org/@hash/types/entity-type/how-to-block-step
 */
export type HowToBlockIntroductionProperties = {
"https://blockprotocol.org/@blockprotocol/types/property-type/title/"?: TitlePropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/description/"?: DescriptionPropertyValue
}



export type HowToBlockStep = Entity<HowToBlockStepProperties>





/**
 * Defines a single step within a How-To Block.
 * 
 * See: https://blockprotocol.org/@hash/types/entity-type/how-to-block
 */
export type HowToBlockStepProperties = {
"https://blockprotocol.org/@blockprotocol/types/property-type/title/"?: TitlePropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/description/"?: DescriptionPropertyValue
}


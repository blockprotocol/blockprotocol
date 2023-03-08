/**
 * This file was automatically generated – do not edit it.
 * See the respective URLs for the Block Protocol Types this was generated from.
 */

import { Entity, LinkData } from "@blockprotocol/graph"

import { AIImageBlock, AIImageBlockProperties, DescriptionPropertyValue, FileNamePropertyValue, FileURLPropertyValue, LinkProperties, MIMETypePropertyValue, RemoteFileProperties, Text } from "./shared"

export type { AIImageBlock, AIImageBlockProperties, DescriptionPropertyValue, FileNamePropertyValue, FileURLPropertyValue, LinkProperties, MIMETypePropertyValue, RemoteFileProperties, Text }



export type BlockEntity = AIImageBlock



export type Generated = Entity<GeneratedProperties> & { linkData: LinkData }


/**
 * Generated, created, or produced, this thing.
 */
export type GeneratedProperties = (GeneratedProperties1 & GeneratedProperties2)
export type GeneratedProperties1 = LinkProperties


export type GeneratedProperties2 = {

}


/**
 * The prompt provided as an input to an OpenAI-model capable of generating images.
 * 
 * See: https://blockprotocol.org/docs/spec/service-module
 */
export type OpenAIImageModelPromptPropertyValue = Text



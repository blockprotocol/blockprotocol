/**
 * This file was automatically generated – do not edit it.
 * See the respective URLs for the Block Protocol Types this was generated from.
 */


import { AITextBlock, AITextBlockProperties, Text, TextualContentPropertyValue } from "./shared"

export type { AITextBlock, AITextBlockProperties, Text, TextualContentPropertyValue }



export type BlockEntity = AITextBlock


/**
 * The name of an OpenAI model supported by the Block Protocol service module, which is capable of producing text outputs.
 * 
 * This should match the strings within the GPT-3 section of the OpenAI docs, for example: “text-davinci-003”.
 * 
 * See: https://platform.openai.com/docs/models/gpt-3
 */
export type OpenAITextModelNamePropertyValue = Text



/**
 * The prompt provided as an input to an OpenAI-model capable of generating text. 
 * 
 * When submitted alongside a specific model, this should conform to the respective constraints of that model.
 * 
 * See: https://blockprotocol.org/docs/spec/service-module
 */
export type OpenAITextModelPromptPropertyValue = Text



/**
 * This file was automatically generated – do not edit it.
 * See the respective URLs for the Block Protocol Types this was generated from.
 */

import { Entity, LinkData } from "@blockprotocol/graph"

import { Address, AddressLevel1PropertyValue, AddressProperties, Alpha2CountryCodePropertyValue, HasAddress, HasAddressProperties, HasMapImage, HasMapImageProperties, MapboxAddressIDPropertyValue, MapboxFullAddressPropertyValue, MapboxStaticImageZoomLevelPropertyValue, PostalCodePropertyValue, StreetAddressLine1PropertyValue } from "./address-block"
import { Generated, GeneratedProperties, OpenAIImageModelPromptPropertyValue } from "./ai-image-block"
import { OpenAITextModelNamePropertyValue, OpenAITextModelPromptPropertyValue } from "./ai-text-block"
import { CalloutBlockEmojiPropertyValue } from "./callout-block"
import { CodeBlockLanguagePropertyValue } from "./code-block"
import { Boolean, CountdownBlockShouldDisplayTimePropertyValue } from "./countdown-block"
import { CSSBackgroundColorPropertyValue, HeightInPixelsPropertyValue } from "./divider-block"
import { HasHowToBlockIntroduction, HasHowToBlockIntroductionProperties, HasHowToBlockStep, HasHowToBlockStepProperties, HowToBlockIntroduction, HowToBlockIntroductionProperties, HowToBlockStep, HowToBlockStepProperties } from "./how-to-block"
import { WidthInPixelsPropertyValue } from "./image-block"
import { EmployedBy, EmployedByProperties } from "./person"
import { HasRepresentativeShuffleBlockItem, HasRepresentativeShuffleBlockItemProperties, ShuffleBlockItemAssociatedLinkEntityIDPropertyValue, ShuffleBlockItemIDPropertyValue, ShuffleBlockItemPropertyValue } from "./shuffle-block"
import { StartTimePropertyValue, StopwatchBlockLapPropertyValue } from "./stopwatch-block"
import { TimerBlockPauseDurationPropertyValue, TimerBlockProgressPropertyValue, TimerBlockTotalDurationPropertyValue } from "./timer-block"

export type { Address, AddressLevel1PropertyValue, AddressProperties, Alpha2CountryCodePropertyValue, HasAddress, HasAddressProperties, HasMapImage, HasMapImageProperties, MapboxAddressIDPropertyValue, MapboxFullAddressPropertyValue, MapboxStaticImageZoomLevelPropertyValue, PostalCodePropertyValue, StreetAddressLine1PropertyValue }
export type { Generated, GeneratedProperties, OpenAIImageModelPromptPropertyValue }
export type { OpenAITextModelNamePropertyValue, OpenAITextModelPromptPropertyValue }
export type { CalloutBlockEmojiPropertyValue }
export type { CodeBlockLanguagePropertyValue }
export type { Boolean, CountdownBlockShouldDisplayTimePropertyValue }
export type { CSSBackgroundColorPropertyValue, HeightInPixelsPropertyValue }
export type { HasHowToBlockIntroduction, HasHowToBlockIntroductionProperties, HasHowToBlockStep, HasHowToBlockStepProperties, HowToBlockIntroduction, HowToBlockIntroductionProperties, HowToBlockStep, HowToBlockStepProperties }
export type { WidthInPixelsPropertyValue }
export type { EmployedBy, EmployedByProperties }
export type { HasRepresentativeShuffleBlockItem, HasRepresentativeShuffleBlockItemProperties, ShuffleBlockItemAssociatedLinkEntityIDPropertyValue, ShuffleBlockItemIDPropertyValue, ShuffleBlockItemPropertyValue }
export type { StartTimePropertyValue, StopwatchBlockLapPropertyValue }
export type { TimerBlockPauseDurationPropertyValue, TimerBlockProgressPropertyValue, TimerBlockTotalDurationPropertyValue }



export type AIImageBlock = Entity<AIImageBlockProperties>


export type AIImageBlockGeneratedLinks = { linkEntity: Generated; target: RemoteFile }

export type AIImageBlockOutgoingLinkAndTargets = AIImageBlockGeneratedLinks

export type AIImageBlockOutgoingLinksByLinkEntityTypeId = { "https://blockprotocol.org/@hash/types/entity-type/generated/v/1": AIImageBlockGeneratedLinks }



/**
 * The block entity of the AI [generated] image block.
 * 
 * See: https://blockprotocol.org/@hash/blocks/ai-image
 */
export type AIImageBlockProperties = {
"https://blockprotocol.org/@blockprotocol/types/property-type/openai-image-model-prompt/"?: OpenAIImageModelPromptPropertyValue
}



export type AITextBlock = Entity<AITextBlockProperties>






/**
 * The block entity of the AI [generated] text block.
 * 
 * See: https://blockprotocol.org/@hash/blocks/ai-text
 */
export type AITextBlockProperties = {
"https://blockprotocol.org/@blockprotocol/types/property-type/openai-text-model-name/"?: OpenAITextModelNamePropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/openai-text-model-prompt/"?: OpenAITextModelPromptPropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/textual-content/"?: TextualContentPropertyValue
}



export type AddressBlock = Entity<AddressBlockProperties>


export type AddressBlockHasAddressLinks = { linkEntity: HasAddress; target: Address }

export type AddressBlockHasMapImageLinks = { linkEntity: HasMapImage; target: RemoteFile }

export type AddressBlockOutgoingLinkAndTargets = AddressBlockHasAddressLinks | AddressBlockHasMapImageLinks

export type AddressBlockOutgoingLinksByLinkEntityTypeId = { "https://blockprotocol.org/@hash/types/entity-type/has-address/v/1": AddressBlockHasAddressLinks, "https://blockprotocol.org/@hash/types/entity-type/has-map-image/v/1": AddressBlockHasMapImageLinks }






/**
 * The block entity of the “Address” block.
 * 
 * See: https://blockprotocol.org/@hash/blocks/address
 */
export type AddressBlockProperties = {
"https://blockprotocol.org/@blockprotocol/types/property-type/title/"?: TitlePropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/description/"?: DescriptionPropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/mapbox-static-image-zoom-level/"?: MapboxStaticImageZoomLevelPropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/mapbox-address-id/"?: MapboxAddressIDPropertyValue
}


/**
 * A URL that contains an image associated with a user, person, character, or persona
 */
export type AvatarPropertyValue = Text




export type CalloutBlock = Entity<CalloutBlockProperties>





/**
 * The block entity for the “Callout” block.
 * 
 * See: https://blockprotocol.org/@hash/blocks/callout
 */
export type CalloutBlockProperties = {
"https://blockprotocol.org/@blockprotocol/types/property-type/textual-content/"?: TextualContentPropertyValue
"https://blockprotocol.org/@hash/types/property-type/callout-block-emoji/"?: CalloutBlockEmojiPropertyValue
}


/**
 * A brief explanation or accompanying message.
 */
export type CaptionPropertyValue = Text




export type CodeBlock = Entity<CodeBlockProperties>






/**
 * The block entity of the “Code” block.
 * 
 * See: https://blockprotocol.org/@hash/blocks/code
 */
export type CodeBlockProperties = {
"https://blockprotocol.org/@blockprotocol/types/property-type/caption/"?: CaptionPropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/textual-content/"?: TextualContentPropertyValue
"https://blockprotocol.org/@hash/types/property-type/code-block-language/"?: CodeBlockLanguagePropertyValue
}



export type CountdownBlock = Entity<CountdownBlockProperties>






/**
 * The block entity for the “Countdown” block.
 * 
 * See: https://blockprotocol.org/@hash/blocks/countdown
 */
export type CountdownBlockProperties = {
"https://blockprotocol.org/@blockprotocol/types/property-type/title/"?: TitlePropertyValue
"https://blockprotocol.org/@hash/types/property-type/target-date-and-time/"?: TargetDateAndTimePropertyValue
"https://blockprotocol.org/@hash/types/property-type/countdown-block-should-display-time/"?: CountdownBlockShouldDisplayTimePropertyValue
}


/**
 * A piece of text that tells you about something or someone. This can include explaining what they look like, what its purpose is for, what they’re like, etc.
 */
export type DescriptionPropertyValue = Text




export type DisplaysMediaFile = Entity<DisplaysMediaFileProperties> & { linkData: LinkData }


/**
 * Displays this media file.
 */
export type DisplaysMediaFileProperties = (DisplaysMediaFileProperties1 & DisplaysMediaFileProperties2)
export type DisplaysMediaFileProperties1 = LinkProperties


export type DisplaysMediaFileProperties2 = {

}



export type DividerBlock = Entity<DividerBlockProperties>





/**
 * The block entity for the “Divider” block.
 * 
 * See: https://blockprotocol.org/@hash/blocks/divider
 */
export type DividerBlockProperties = {
"https://blockprotocol.org/@blockprotocol/types/property-type/height-in-pixels/"?: HeightInPixelsPropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/css-background-color/"?: CSSBackgroundColorPropertyValue
}


/**
 * An e-mail address
 */
export type EMailPropertyValue = Text



/**
 * The name of a file.
 */
export type FileNamePropertyValue = Text



/**
 * A URL that serves a file.
 */
export type FileURLPropertyValue = Text




export type FoundedBy = Entity<FoundedByProperties> & { linkData: LinkData }


/**
 * Established, initiated, or created by this entity.
 */
export type FoundedByProperties = (FoundedByProperties1 & FoundedByProperties2)
export type FoundedByProperties1 = LinkProperties


export type FoundedByProperties2 = {

}



export type HowToBlock = Entity<HowToBlockProperties>


export type HowToBlockHasHowToBlockIntroductionLinks = { linkEntity: HasHowToBlockIntroduction; target: HowToBlockIntroduction }

export type HowToBlockHasHowToBlockStepLinks = { linkEntity: HasHowToBlockStep; target: HowToBlockStep }

export type HowToBlockOutgoingLinkAndTargets = HowToBlockHasHowToBlockStepLinks | HowToBlockHasHowToBlockIntroductionLinks

export type HowToBlockOutgoingLinksByLinkEntityTypeId = { "https://blockprotocol.org/@hash/types/entity-type/has-how-to-block-step/v/1": HowToBlockHasHowToBlockStepLinks, "https://blockprotocol.org/@hash/types/entity-type/has-how-to-block-introduction/v/1": HowToBlockHasHowToBlockIntroductionLinks }




/**
 * The block entity for the "How-To" block.
 * 
 * See: https://blockprotocol.org/@hash/blocks/how-to
 */
export type HowToBlockProperties = {
"https://blockprotocol.org/@blockprotocol/types/property-type/title/"?: TitlePropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/description/"?: DescriptionPropertyValue
}



export type ImageBlock = Entity<ImageBlockProperties>


export type ImageBlockDisplaysMediaFileLinks = { linkEntity: DisplaysMediaFile; target: RemoteFile }

export type ImageBlockOutgoingLinkAndTargets = ImageBlockDisplaysMediaFileLinks

export type ImageBlockOutgoingLinksByLinkEntityTypeId = { "https://blockprotocol.org/@hash/types/entity-type/displays-media-file/v/1": ImageBlockDisplaysMediaFileLinks }




/**
 * The block entity for the “Image” block.
 * 
 * See: https://blockprotocol.org/@hash/blocks/image
 */
export type ImageBlockProperties = {
"https://blockprotocol.org/@blockprotocol/types/property-type/caption/"?: CaptionPropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/width-in-pixels/"?: WidthInPixelsPropertyValue
}



export type Link = Entity<LinkProperties>


export type LinkProperties = {

}


/**
 * A MIME (Multipurpose Internet Mail Extensions) type.
 * 
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
 */
export type MIMETypePropertyValue = Text




export type MyNewPerson = Entity<MyNewPersonProperties>


export type MyNewPersonEmployedByLinks = { linkEntity: EmployedBy; target: Organization }

export type MyNewPersonOutgoingLinkAndTargets = MyNewPersonEmployedByLinks

export type MyNewPersonOutgoingLinksByLinkEntityTypeId = { "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/employed-by/v/1": MyNewPersonEmployedByLinks }






/**
 * A human being or individual
 */
export type MyNewPersonProperties = {
"https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/name/"?: NamePropertyValue
"https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/website/"?: WebsitePropertyValue
"https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/avatar/"?: AvatarPropertyValue
"https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/e-mail/"?: EMailPropertyValue
}



export type MyOldPerson = Entity<MyOldPersonProperties>







/**
 * A human being or individual
 */
export type MyOldPersonProperties = {
"https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/name/"?: NamePropertyValue
"https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/website/"?: WebsitePropertyValue
"https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/avatar/"?: AvatarPropertyValue
"https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/e-mail/"?: EMailPropertyValue
}


/**
 * A word or set of words by which something is known, addressed, or referred to
 */
export type NamePropertyValue = Text



/**
 * An arithmetical value (in the Real number system)
 */
export type Number = number



export type Organization = Entity<OrganizationProperties>


export type OrganizationFoundedByLinks = { linkEntity: FoundedBy; target: MyOldPerson }

export type OrganizationOutgoingLinkAndTargets = OrganizationFoundedByLinks

export type OrganizationOutgoingLinksByLinkEntityTypeId = { "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/founded-by/v/1": OrganizationFoundedByLinks }




/**
 * A group of entities (people, companies, etc.) focused on a common purpose
 */
export type OrganizationProperties = {
"https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/name/"?: NamePropertyValue
"https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/website/"?: WebsitePropertyValue
}



export type RemoteFile = Entity<RemoteFileProperties>







/**
 * Information about a file hosted at a remote URL.
 */
export type RemoteFileProperties = {
"https://blockprotocol.org/@blockprotocol/types/property-type/description/"?: DescriptionPropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/file-url/": FileURLPropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/mime-type/": MIMETypePropertyValue
"https://blockprotocol.org/@blockprotocol/types/property-type/file-name/": FileNamePropertyValue
}



export type ShuffleBlock = Entity<ShuffleBlockProperties>


export type ShuffleBlockHasRepresentativeShuffleBlockItemLinks = { linkEntity: HasRepresentativeShuffleBlockItem; target: Entity }

export type ShuffleBlockOutgoingLinkAndTargets = ShuffleBlockHasRepresentativeShuffleBlockItemLinks

export type ShuffleBlockOutgoingLinksByLinkEntityTypeId = { "https://blockprotocol.org/@hash/types/entity-type/has-representative-shuffle-block-item/v/1": ShuffleBlockHasRepresentativeShuffleBlockItemLinks }



/**
 * The block entity of the “Shuffle” block.
 * 
 * See: https://blockprotocol.org/@hash/blocks/shuffle
 */
export type ShuffleBlockProperties = {
/**
 * @minItems 0
 */
"https://blockprotocol.org/@hash/types/property-type/shuffle-block-item/"?: ShuffleBlockItemPropertyValue[]
}



export type StopwatchBlock = Entity<StopwatchBlockProperties>





/**
 * The block entity of the “Stopwatch” block.
 * 
 * See: https://blockprotocol.org/@hash/blocks/stopwatch
 */
export type StopwatchBlockProperties = {
/**
 * @minItems 0
 */
"https://blockprotocol.org/@hash/types/property-type/stopwatch-block-lap/"?: StopwatchBlockLapPropertyValue[]
"https://blockprotocol.org/@hash/types/property-type/start-time/"?: StartTimePropertyValue
}


/**
 * An ISO-8601 formatted date and time that acts as the target for something.
 * 
 * For example: “2233-03-22T13:30:23Z”
 */
export type TargetDateAndTimePropertyValue = Text



/**
 * An ordered sequence of characters
 */
export type Text = string


/**
 * The text material, information, or body, that makes up the content of this thing.
 */
export type TextualContentPropertyValue = Text




export type TimerBlock = Entity<TimerBlockProperties>





/**
 * The block entity for the “Timer” block.
 * 
 * See: https://blockprotocol.org/@hash/blocks/timer
 */
export type TimerBlockProperties = {
"https://blockprotocol.org/@hash/types/property-type/timer-block-progress/"?: TimerBlockProgressPropertyValue
"https://blockprotocol.org/@hash/types/property-type/timer-block-total-duration/"?: TimerBlockTotalDurationPropertyValue
}


/**
 * The name given to something to identify it, generally associated with objects or inanimate things such as books, websites, songs, etc.
 */
export type TitlePropertyValue = Text




export type VideoBlock = Entity<VideoBlockProperties>


export type VideoBlockDisplaysMediaFileLinks = { linkEntity: DisplaysMediaFile; target: RemoteFile }

export type VideoBlockOutgoingLinkAndTargets = VideoBlockDisplaysMediaFileLinks

export type VideoBlockOutgoingLinksByLinkEntityTypeId = { "https://blockprotocol.org/@hash/types/entity-type/displays-media-file/v/1": VideoBlockDisplaysMediaFileLinks }



/**
 * The block entity for the “Video” block.
 * 
 * See: https://blockprotocol.org/@hash/blocks/video
 */
export type VideoBlockProperties = {
"https://blockprotocol.org/@blockprotocol/types/property-type/caption/"?: CaptionPropertyValue
}


/**
 * A URL linking to a given website
 */
export type WebsitePropertyValue = Text



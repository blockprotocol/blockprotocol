/**
 * This file was automatically generated – do not edit it.
 * See the respective URLs for the Block Protocol Types this was generated from.
 */


import { TargetDateAndTimePropertyValue, Text, TimerBlock, TimerBlockProperties } from "./shared"

export type { TargetDateAndTimePropertyValue, Text, TimerBlock, TimerBlockProperties }



export type BlockEntity = TimerBlock


/**
 * An ISO-8601 formatted duration, which remaining duration on the timer block when it has been paused. The elapsed time can be calculated by subtracting this value from the total duration.
 * 
 * For example: `PT42M24S` corresponds to 42 minutes and 24 seconds.
 * 
 * See: https://blockprotocol.org/@hash/blocks/timer
 */
export type TimerBlockPauseDurationPropertyValue = Text



/**
 * Defines the relative offsets of the timer block when in a paused or unpaused state, respective to the total duration.
 * 
 * See: 
 * - https://blockprotocol.org/@hash/types/property-type/timer-block-total-duration
 * - https://blockprotocol.org/@hash/blocks/timer
 */
export type TimerBlockProgressPropertyValue = ({
"https://blockprotocol.org/@hash/types/property-type/target-date-and-time/": TargetDateAndTimePropertyValue
} | {
"https://blockprotocol.org/@hash/types/property-type/timer-block-pause-duration/": TimerBlockPauseDurationPropertyValue
})




/**
 * An ISO-8601 formatted duration, which is the total duration the timer will countdown for once the play button is clicked.
 * 
 * For example: `PT42M24S` corresponds to 42 minutes and 24 seconds.
 * 
 * See: https://blockprotocol.org/@hash/blocks/timer
 */
export type TimerBlockTotalDurationPropertyValue = Text



/**
 * This file was automatically generated – do not edit it.
 * See the respective URLs for the Block Protocol Types this was generated from.
 */


import { Number, StopwatchBlock, StopwatchBlockProperties, Text } from "./shared"

export type { Number, StopwatchBlock, StopwatchBlockProperties, Text }



export type BlockEntity = StopwatchBlock


/**
 * An ISO-8601 formatted date and time which identifies the start of something.
 * 
 * For example: “2233-03-22T13:30:23Z”
 */
export type StartTimePropertyValue = Text



/**
 * The number of milliseconds elapsed in a lap of the stopwatch, expressed as a non-negative integer.
 */
export type StopwatchBlockLapPropertyValue = Number



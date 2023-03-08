/**
 * This file was automatically generated – do not edit it.
 * See the respective URLs for the Block Protocol Types this was generated from.
 */


import { DividerBlock, DividerBlockProperties, Number, Text } from "./shared"

export type { DividerBlock, DividerBlockProperties, Number, Text }



export type BlockEntity = DividerBlock


/**
 * The text color represented as a CSS-compatible color property expressed as a string.
 * 
 * This is any ‘legal’ color value in CSS, for example (but not limited to)
 * 
 * - a hexadecimal string: “#FFFFFF”
 * 
 * - a named color: “skyblue”
 * 
 * - an RGB value in functional notation: “rgb(255, 0, 255)”
 * 
 * - an HSLA value in functional notation: “hsla(120, 100%, 50%)”
 * 
 * See: https://www.w3schools.com/cssref/css_colors_legal.php
 */
export type CSSBackgroundColorPropertyValue = Text



/**
 * The height of a UI element in pixels.
 */
export type HeightInPixelsPropertyValue = Number



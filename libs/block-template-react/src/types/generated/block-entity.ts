/**
 * This file was automatically generated – do not edit it.
 */

import { Entity } from "@blockprotocol/graph";

export type BlockEntity = MinesweeperBlock;

export type BlockEntityOutgoingLinkAndTarget =
  MinesweeperBlockOutgoingLinkAndTarget;

export type MinesweeperBlock = Entity<MinesweeperBlockProperties>;

export type MinesweeperBlockOutgoingLinkAndTarget = never;

export type MinesweeperBlockOutgoingLinksByLinkEntityTypeId = {};

/**
 * The block entity of the "Minesweeper" block
 */
export type MinesweeperBlockProperties = {
  "https://blockprotocol-molpob88k.stage.hash.ai/@ciaranm/types/property-type/number-of-columns/"?: NumberOfColumnsPropertyValue;
  "https://blockprotocol-molpob88k.stage.hash.ai/@ciaranm/types/property-type/number-of-bombs/"?: NumberOfBombsPropertyValue;
};

/**
 * An arithmetical value (in the Real number system)
 */
export type Number = number;

/**
 * How many bombs should be or are in something
 */
export type NumberOfBombsPropertyValue = Number;

/**
 * How many columns should be or are in something
 */
export type NumberOfColumnsPropertyValue = Number;

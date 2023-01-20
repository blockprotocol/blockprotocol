import { EntityRecordId, OntologyTypeRecordId } from "@blockprotocol/graph";

import { Depths, PartialDepths } from "./traversal-context";

export class ResolveMap {
  constructor(public map: Record<string, Depths>) {}

  /**
   *  Inserts an identifier of a given graph element into the map.
   *
   *  If the element does not already exist in the map, it will be inserted with the provided `depths`. In the case
   *  that the element already exists, the `depths` will be compared with depths used when inserting it before:
   *  - If there weren't any previous depths, the entry is set to the given depths, and returns them back as an
   *      indicator that all of them were missing
   *  - If some of the new `depths` are higher, the entry in the map is merged with them, and this returns the subset
   *      of depths that need further resolution.
   *  - If all of the new `depths` are lower, the map is not updated and an empty object is returned
   * @param identifier
   * @param {PartialDepths} depths - the depths at which this current branch intends to resolve for the given
   *    element
   * @returns {PartialDepths} - the depths which where greater or missing for the given element
   */
  insert(
    identifier: EntityRecordId | OntologyTypeRecordId,
    depths: PartialDepths,
  ): PartialDepths {
    const idString = JSON.stringify(identifier);

    const previousDepths = this.map[idString];
    if (previousDepths) {
      return previousDepths.update(depths);
    } else {
      this.map[idString] = new Depths(depths);
      return { ...depths };
    }
  }
}

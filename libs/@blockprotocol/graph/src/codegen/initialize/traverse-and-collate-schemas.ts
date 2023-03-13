import {
  getReferencedIdsFromEntityType,
  getReferencedIdsFromPropertyType,
  VersionedUrl,
} from "@blockprotocol/type-system/slim";

import { typedValues } from "../../shared/util/typed-object-iter";
import { InitializeContext } from "../context.js";
import { fetchTypeAsJson } from "./traverse/fetch.js";
import {
  isDataType,
  isEntityType,
  isPropertyType,
} from "./traverse/type-validation.js";

/** A simple helper method which saves some duplication below, and avoids intermediary array allocations */
const nestedForEach = <T>(arrays: T[][], callback: (ele: T) => void) => {
  arrays.forEach((array) => {
    array.forEach((element) => {
      callback(element);
    });
  });
};

/**
 * Keeps track of types to explore, types that have been explored, and their resolved dependency graph as its explored.
 */
class TraversalContext {
  initialContext: InitializeContext;

  exploreQueue: Set<VersionedUrl>;
  explored: Set<VersionedUrl>;

  constructor(initialContext: InitializeContext) {
    this.initialContext = initialContext;

    this.explored = new Set();
    this.exploreQueue = new Set();

    for (const { versionedUrls } of typedValues(
      initialContext.parameters.targets,
    )) {
      for (const versionedUrl of versionedUrls) {
        initialContext.logTrace(`Adding ${versionedUrl} to explore queue.`);
        this.exploreQueue.add(versionedUrl);
      }
    }
  }

  /**
   * This handles the necessary logic when encountering a type during traversal.
   *
   * If the type has been encountered and resolved before, this updates the relevant references to it, otherwise it
   * adds it to the explore queue for continued traversal.
   *
   * @param sourceUrl
   * @param dependentUrl
   */
  encounter(sourceUrl: VersionedUrl, dependentUrl: VersionedUrl) {
    if (
      !this.explored.has(dependentUrl) &&
      !this.exploreQueue.has(dependentUrl)
    ) {
      this.initialContext.logTrace(
        `Adding ${dependentUrl} to explore queue, as it was encountered as a dependency of ${sourceUrl}.`,
      );
      this.exploreQueue.add(dependentUrl);
    } else {
      this.initialContext.logTrace(
        `Skipping ${dependentUrl} as a dependency of ${sourceUrl}, as it has already been explored.`,
      );
    }

    this.initialContext.typeDependencyMap.addDependencyForType(
      sourceUrl,
      dependentUrl,
    );
  }

  /**
   * This indicates the next type to explore, if there is one in the queue.
   */
  nextToExplore(): VersionedUrl | undefined {
    const typeUrl = this.exploreQueue.values().next().value;
    if (typeUrl) {
      this.exploreQueue.delete(typeUrl);
      this.explored.add(typeUrl);
    }
    return typeUrl;
  }
}

export const traverseAndCollateSchemas = async (
  initialContext: InitializeContext,
): Promise<void> => {
  const traversalContext = new TraversalContext(initialContext);

  const fetchQueue: Promise<void>[] = [];

  const addFetchPromise = (fetchPromise: Promise<void>) => {
    fetchQueue.push(fetchPromise);

    void fetchPromise.then(() => {
      fetchQueue.splice(fetchQueue.indexOf(fetchPromise), 1);
    });
  };

  // Somewhat concurrent fetch queue, keep exploring as long as there is an in-flight request or there are more to
  // explore
  while (traversalContext.exploreQueue.size > 0 || fetchQueue.length > 0) {
    const typeUrl = traversalContext.nextToExplore();

    if (!typeUrl) {
      // wait a bit before checking the loop again
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });

      continue;
    }

    initialContext.logDebug(`Fetching ${typeUrl}...`);

    addFetchPromise(
      fetchTypeAsJson(typeUrl).then((type) => {
        if (isDataType(type)) {
          initialContext.addDataType(type);
        } else if (isPropertyType(type)) {
          const {
            constrainsValuesOnDataTypes,
            constrainsPropertiesOnPropertyTypes,
          } = getReferencedIdsFromPropertyType(type);

          nestedForEach(
            [constrainsValuesOnDataTypes, constrainsPropertiesOnPropertyTypes],
            (dependentUrl) => traversalContext.encounter(typeUrl, dependentUrl),
          );

          initialContext.addPropertyType(type);
        } else if (isEntityType(type)) {
          const {
            constrainsPropertiesOnPropertyTypes,
            constrainsLinkDestinationsOnEntityTypes,
            constrainsLinksOnEntityTypes,
            inheritsFromEntityTypes,
          } = getReferencedIdsFromEntityType(type);

          nestedForEach(
            [
              constrainsPropertiesOnPropertyTypes,
              constrainsLinkDestinationsOnEntityTypes,
              constrainsLinksOnEntityTypes,
              inheritsFromEntityTypes,
            ],
            (dependentUrl) => traversalContext.encounter(typeUrl, dependentUrl),
          );

          initialContext.addEntityType(type);
        } else {
          throw new Error(`Unexpected type, was it malformed? URL: ${typeUrl}`);
        }
      }),
    );
  }
};

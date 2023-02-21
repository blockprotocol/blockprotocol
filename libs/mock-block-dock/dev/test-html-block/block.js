/* global blockprotocol */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck -- unable to typecheck GraphBlockHandler because of URL import

import {
  extractBaseUri,
  GraphBlockHandler,
} from "https://esm.sh/@blockprotocol/graph@0.1.0-canary-20230223103409";
import { getRoots } from "https://esm.sh/@blockprotocol/graph@0.1.0-canary-20230223103409/stdlib";

const propertyTypeIds = {
  name: "http://example.com/types/property-type/name/v/1",
};

const element = blockprotocol.getBlockContainer(import.meta.url);

const title = element.querySelector("[data-title]");
const paragraph = element.querySelector("[data-paragraph]");
const input = element.querySelector("[data-input]");
const readonlyParagraph = element.querySelector("[data-readonly]");

let entity;

const handler = new GraphBlockHandler({
  element,
  callbacks: {
    blockEntitySubgraph: ({ data: entitySubgraph }) => {
      entity = getRoots(entitySubgraph)[0];
      if (!entity) {
        throw new Error(
          "Couldn't find block entity in the roots of the subgraph",
        );
      }

      title.innerText = `Hello, ${
        entity.properties[extractBaseUri(propertyTypeIds.name)]
      }`;
      paragraph.innerText = `The entityId of this block is ${entity.metadata.recordId.entityId}. Use it to update its data when calling updateEntity`;
      input.value = entity.properties[extractBaseUri(propertyTypeIds.name)];
      readonlyParagraph.innerText = input.value;
    },
    readonly: ({ data: readonly }) => {
      if (!readonly) {
        readonlyParagraph.style.display = "none";
        input.style.display = "block";
      }

      if (readonly) {
        input.style.display = "none";
        readonlyParagraph.style.display = "block";
      }
    },
  },
});

input.addEventListener("change", (event) => {
  if (entity) {
    handler
      .updateEntity({
        data: {
          entityId: entity.metadata.recordId.entityId,
          entityTypeId: entity.metadata.entityTypeId,
          properties: {
            [extractBaseUri(propertyTypeIds.name)]: event.target.value,
          },
        },
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(`Error calling updateEntity: ${err}`);
      });
  }
});

/* global blockprotocol */
import {
  extractBaseUrl,
  GraphBlockHandler,
} from "https://esm.sh/@blockprotocol/graph@0.1.0-canary-20230228184514";
import { getRoots } from "https://esm.sh/@blockprotocol/graph@0.1.0-canary-20230228184514/stdlib";

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
  /**
   * Here you can register functions will be called when your block receives specific messages from the application.
   * The example here is handling 'blockEntitySubgraph', which is the subgraph rooted at the entity associated directly
   * with this instance of the block.
   * @see https://blockprotocol.org/docs/spec/graph-module#message-definitions for other such messages
   */
  callbacks: {
    blockEntitySubgraph: ({ data: entitySubgraph }) => {
      // Here we set entity to the blockEntitySubgraph's root, so we can use it to update the entity later (in the 'change' listener below)
      entity = getRoots(entitySubgraph)[0];
      if (!entity) {
        throw new Error(
          "Couldn't find block entity in the roots of the subgraph",
        );
      }

      title.innerText = `Hello, ${
        entity.properties[extractBaseUrl(propertyTypeIds.name)]
      }`;
      paragraph.innerText = `The entityId of this block is ${entity.metadata.recordId.entityId}. Use it to update its data when calling updateEntity`;
      input.value = entity.properties[extractBaseUrl(propertyTypeIds.name)];
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
    /**
     * This is an example of using the graph module to send a message to the embedding application
     * – this particular message asks the application update an entity's data.
     * The specific entity to update is identified by its 'entityId'
     * – we want to update the block entity, so we are passing the 'entityId' we retrieved earlier from the roots of the
     *  blockEntitySubgraph
     *
     * Many other messages are available for your block to:
     *  - read and update entities
     *  - create link entities
     *  - and more
     * @see https://blockprotocol.org/docs/spec/graph-module#message-definitions
     */
    handler
      .updateEntity({
        data: {
          entityId: entity.metadata.recordId.entityId,
          entityTypeId: entity.metadata.entityTypeId,
          properties: {
            [extractBaseUrl(propertyTypeIds.name)]: event.target.value,
          },
        },
      })
      .catch((err) => {
        console.error(`Error calling updateEntity: ${err}`);
      });
  }
});

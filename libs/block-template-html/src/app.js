/* global blockprotocol */
import { GraphBlockHandler } from "https://esm.sh/@blockprotocol/graph@0.0.11";

const element = blockprotocol.getBlockContainer(import.meta.url);

const title = element.querySelector("[data-title]");
const paragraph = element.querySelector("[data-paragraph]");
const input = element.querySelector("[data-input]");

let entityId;

const handler = new GraphBlockHandler({
  element,
  /**
   * Here you can register functions will be called when your block receives specific messages from the application.
   * The example here is handling 'blockEntity', which is the entity associated directly with this instance of the block.
   * @see https://blockprotocol.org/docs/spec/graph-service#message-definitions for other such messages
   */
  callbacks: {
    blockEntity: (entity) => {
      // Here we set entity to the blockEntity's entityId, so we can use to update the entity (in the 'change' listener below)
      entityId = entity.data.entityId;

      title.innerText = `Hello, ${entity.data.properties.name}`;
      paragraph.innerText = `The entityId of this block is ${entity.data.entityId}. Use it to update its data when calling updateEntity`;
      input.value = entity.data.properties.name;
    },
  },
});

input.addEventListener("change", (event) => {
  if (entityId) {
    /**
     * This is an example of using the graph service to send a message to the embedding application
     * – this particular message asks the application update an entity's properties.
     * The specific entity to update is identified by 'entityId'
     * – we are passing the 'entityId' of the entity loaded into the block ('blockEntity').
     *
     * Many other messages are available for your block to read and update entities, and links between entities
     * @see https://blockprotocol.org/docs/spec/graph-service#message-definitions
     */
    handler
      .updateEntity({
        data: {
          entityId,
          properties: { name: event.target.value },
        },
      })
      .catch((err) => {
        console.error(`Error calling updateEntity: ${err}`);
      });
  }
});

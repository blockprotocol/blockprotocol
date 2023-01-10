/* global blockprotocol */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck -- unable to typecheck GraphBlockHandler because of URL import

import { GraphBlockHandler } from "https://esm.sh/@blockprotocol/graph@0.0.11";

const element = blockprotocol.getBlockContainer(import.meta.url);

const title = element.querySelector("[data-title]");
const paragraph = element.querySelector("[data-paragraph]");
const input = element.querySelector("[data-input]");
const readonlyParagraph = element.querySelector("[data-readonly]");

let entityId;

const handler = new GraphBlockHandler({
  element,
  callbacks: {
    blockEntity: (entity) => {
      entityId = entity.data.entityId;

      title.innerText = `Hello, ${entity.data.properties.name}`;
      paragraph.innerText = `The entityId of this block is ${entity.data.entityId}. Use it to update its data when calling updateEntity`;
      input.value = entity.data.properties.name;
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
  if (entityId) {
    handler
      .updateEntity({
        data: {
          entityId,
          properties: { name: event.target.value },
        },
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(`Error calling updateEntity: ${err}`);
      });
  }
});

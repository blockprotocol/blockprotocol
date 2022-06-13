import { GraphBlockHandler } from "@blockprotocol/graph";

const element = window.blockprotocol.getBlockContainer(
  document.currentScript ?? import.meta.url,
);

const title = element.querySelector("[data-title]");
const paragraph = element.querySelector("[data-paragraph]");
const input = element.querySelector("[data-input]");

let entityId;

const handler = new GraphBlockHandler({
  element,
  callbacks: {
    blockEntity: (entity) => {
      entityId = entity.data.entityId;

      title.innerText = `Hello, ${entity.data.properties.name}`;
      paragraph.innerText = `The entityId of this block is ${entity.data.entityId}. Use it to update its data when calling updateEntities`;
      input.value = entity.data.properties.name;
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
        console.error(err);
      });
  }
});

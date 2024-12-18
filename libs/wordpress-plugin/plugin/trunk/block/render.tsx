import { buildSubgraph } from "@blockprotocol/graph/stdlib";
import { createRoot } from "react-dom/client";

import {
  blockSubgraphResolveDepths,
  dbEntityToEntity,
  getEntitySubgraph,
} from "./shared/api";
import { BlockLoader } from "./shared/block-loader";

/**
 * For each Block Protocol block in a WordPress page, when in view mode the dynamic render function on the server:
 * 1. adds a div to the rendered page with two attributes, indicating the id of the (a) entity and (b) block
 * 2. fetches the (a) entity data from the db and (b) block source from the BP Hub, and attaches both to the window
 *
 * This function:
 * 1. finds the BP divs in the server-rendered HTML
 * 2. takes the entity props and component source from the window
 * 3. renders the component with the entity props
 *
 * @see block_dynamic_render_callback in block-protocol.php
 */

document.addEventListener("DOMContentLoaded", () => {
  const blocks = document.querySelectorAll(".block-protocol-block");

  for (const block of blocks) {
    const entityId = (block as HTMLElement).dataset.entity;
    const blockName = (block as HTMLElement).dataset.block_name;

    if (!entityId) {
      // eslint-disable-next-line no-console -- log to help debug user issues (this should not happen)
      console.error(
        `Block element did not have entity attribute set for ${
          blockName ?? "unknown"
        } block`,
      );
      continue;
    }

    const entities = window.block_protocol_block_data.entities[entityId];
    if (!entities) {
      // eslint-disable-next-line no-console -- log to help debug user issues (this should not happen)
      console.error(
        `Could not render block: no entity with entityId '${entityId}' in window.block_protocl_data_entities`,
      );
      continue;
    }

    const sourceUrl = (block as HTMLElement).dataset.source;
    if (!sourceUrl) {
      // eslint-disable-next-line no-console -- log to help debug user issues (this should not happen)
      console.error("Block element did not have data-source attribute set");
      continue;
    }

    const sourceString =
      window.block_protocol_block_data.sourceStrings[sourceUrl];
    if (!sourceString) {
      // eslint-disable-next-line no-console -- log to help debug user issues (this should not happen)
      console.error(
        `Could not find source for sourceUrl '${sourceUrl}' on window.block_protocol_block_data`,
      );
    }

    if (!blockName) {
      // eslint-disable-next-line no-console -- log to help debug user issues (this should not happen)
      console.error(`No block_name set for block`);
    }

    const rootEntity = entities.find((entity) => entity.entity_id === entityId);

    if (!rootEntity) {
      // eslint-disable-next-line no-console -- log to help debug user issues (this should not happen)
      console.error(
        `Root block entity not present in entities for entity ${entityId} in ${blockName} block`,
      );
    }

    if (!blockName || !sourceString || !entities || !rootEntity) {
      continue;
    }

    const rootEntityRecordId = dbEntityToEntity(rootEntity).metadata.recordId;

    const entitySubgraph = buildSubgraph(
      {
        entities: entities.map(dbEntityToEntity),
        dataTypes: [],
        entityTypes: [],
        propertyTypes: [],
      },
      [rootEntityRecordId],
      blockSubgraphResolveDepths,
    );

    const root = createRoot(block);

    root.render(
      <BlockLoader
        blockName={blockName}
        callbacks={{ graph: { getEntity: getEntitySubgraph } }}
        entitySubgraph={entitySubgraph}
        LoadingImage={() => null}
        readonly
        sourceString={sourceString}
        sourceUrl={sourceUrl}
      />,
    );
  }
});

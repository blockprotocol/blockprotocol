import { VersionedUrl } from "@blockprotocol/graph";
import { MockBlockDock } from "mock-block-dock";
import { createRoot } from "react-dom/client";

import packageJson from "../package.json";
import Component from "./index";
import { RootEntity } from "./types.gen";

const node = document.getElementById("app");

const testEntity: RootEntity = {
  metadata: {
    recordId: {
      entityId: "test-entity",
      editionId: new Date().toISOString(),
    },
    entityTypeId: packageJson.blockprotocol.schema as VersionedUrl,
  },
  properties: {
    "https://blockprotocol.org/@blockprotocol/types/property-type/name/":
      "World",
  },
} as const;

/**
 * This is an embedding application for local development and debugging.
 * It is the application loaded into the browser when you run 'yarn dev' (or 'npm run dev')
 * No data from it will be published with your block or included as part of a production build.
 *
 * The component used here, 'MockBlockDock', does the following:
 * 1. It renders your block on the page and provides the initial properties specified below
 * 2. It holds an in-memory datastore of entities and links
 * 3. It listens for messages from your blocks and updates its datastore appropriately (e.g. to create a new entity)
 * 4. It displays a debug UI allowing you to see the contents of its datastore, and messages sent back and forth
 */
const DevApp = () => {
  return (
    <MockBlockDock
      blockDefinition={{ ReactComponent: Component }}
      blockEntityRecordId={testEntity.metadata.recordId}
      blockInfo={packageJson.blockprotocol}
      debug // remove this to start with the debug UI minimised. You can also toggle it in the UI
      initialData={{
        initialEntities: [testEntity],
      }}
      // hideDebugToggle <- uncomment this to disable the debug UI entirely
      // initialEntities={[]} <- customise the entities in the datastore (blockEntity is always added, if you provide it)
      initialEntityTypes={[
        {
          $schema:
            "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
          $id: "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/founded-by/v/1",
          kind: "entityType",
          title: "Founded by",
          type: "object",
          allOf: [
            {
              $ref: "https://blockprotocol.org/@blockprotocol/types/entity-type/link/v/1",
            },
          ],
          description: "Established, initiated, or created by this entity.",
          examples: [],
          links: {},
          properties: {},
          required: [],
        },
        {
          $schema:
            "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
          $id: "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/organization/v/2",
          kind: "entityType",
          title: "Organization",
          type: "object",
          allOf: [],
          description:
            "A group of entities (people, companies, etc.) focused on a common purpose",
          examples: [],
          links: {
            "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/founded-by/v/1":
              {
                type: "array",
                minItems: 0,
                ordered: false,
                items: {
                  oneOf: [
                    {
                      $ref: "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/person/v/2",
                    },
                  ],
                },
              },
          },
          properties: {
            "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/name/":
              {
                $ref: "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/name/v/1",
              },
            "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/website/":
              {
                $ref: "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/website/v/1",
              },
          },
          required: [],
        },
        {
          allOf: [],
          description: "A generic thing",
          examples: [],
          $id: "https://blockprotocol.org/@blockprotocol/types/entity-type/thing/v/2",
          kind: "entityType",
          links: {},
          properties: {
            "https://blockprotocol.org/@blockprotocol/types/property-type/name/":
              {
                $ref: "https://blockprotocol.org/@blockprotocol/types/property-type/name/v/1",
              },
          },
          required: [],
          title: "Thing",
          type: "object",
          $schema:
            "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
        },
        {
          $schema:
            "https://blockprotocol.org/types/modules/graph/0.3/schema/entity-type",
          $id: "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/person/v/3",
          kind: "entityType",
          title: "Person",
          type: "object",
          allOf: [],
          description: "A human being or individual",
          examples: [],
          links: {
            "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/employed-by/v/1":
              {
                type: "array",
                minItems: 0,
                ordered: false,
                items: {
                  oneOf: [
                    {
                      $ref: "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/entity-type/organization/v/2",
                    },
                  ],
                },
              },
          },
          properties: {
            "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/name/":
              {
                $ref: "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/name/v/1",
              },
            "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/website/":
              {
                $ref: "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/website/v/1",
              },
            "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/avatar/":
              {
                $ref: "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/avatar/v/1",
              },
            "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/e-mail/":
              {
                $ref: "https://blockprotocol-87igvkbkw.stage.hash.ai/@alfie/types/property-type/e-mail/v/1",
              },
          },
          required: [],
        },
      ]}
      // initialLinks={[]} <- customise the links in the datastore
      // initialLinkedQueries={[]} <- customise the linkedQueries in the datastore
      // readonly <- uncomment this to start your block in readonly mode. You can also toggle it in the UI
    />
  );
};

if (node) {
  createRoot(node).render(<DevApp />);
} else {
  throw new Error("Unable to find DOM element with id 'app'");
}

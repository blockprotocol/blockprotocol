import { extractBaseUrl } from "@blockprotocol/graph";
import { EntityTemporalVersioningMetadata } from "@blockprotocol/graph/dist/cjs/temporal/main";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { createRoot } from "react-dom/client";

import { MockBlockDock } from "../src";
import { entityTypes } from "../src/data/entity-types";
import { propertyTypes } from "../src/data/property-types";
import { TestCustomElementBlock } from "./test-custom-element-block";
import testBlockString from "./test-html-block/block.html?raw";
import { TestReactBlock } from "./test-react-block";

const node = document.getElementById("app");

const intervalForAllTime =
  (): EntityTemporalVersioningMetadata[keyof EntityTemporalVersioningMetadata] => {
    return {
      start: {
        kind: "inclusive",
        limit: new Date(0).toISOString(),
      },
      end: {
        kind: "unbounded",
      },
    } as const;
  };

const interval = intervalForAllTime();

const blockEntityMap = {
  react: {
    metadata: {
      recordId: {
        entityId: "entity-react",
        editionId: new Date(0).toISOString(),
      },
      entityTypeId: entityTypes.testType.$id,
      temporalVersioning: {
        transactionTime: interval,
        decisionTime: interval,
      },
    },
    properties: {
      [extractBaseUrl(propertyTypes.name.$id)]: "World",
      [extractBaseUrl(propertyTypes.description.$id)]: "This is a description",
    },
  },
  "custom-element": {
    metadata: {
      recordId: {
        entityId: "entity-custom-element",
        editionId: new Date(0).toISOString(),
      },
      entityTypeId: entityTypes.testType.$id,
      temporalVersioning: {
        transactionTime: interval,
        decisionTime: interval,
      },
    },
    properties: { [extractBaseUrl(propertyTypes.name.$id)]: "World" },
  },
  "html-at-url": {
    metadata: {
      recordId: {
        entityId: "entity-html-as-url",
        editionId: new Date(0).toISOString(),
      },
      entityTypeId: entityTypes.testType.$id,
      temporalVersioning: {
        transactionTime: interval,
        decisionTime: interval,
      },
    },
    properties: { [extractBaseUrl(propertyTypes.name.$id)]: "World" },
  },
  "html-as-string": {
    metadata: {
      recordId: {
        entityId: "entity-html-as-string",
        editionId: new Date(0).toISOString(),
      },
      entityTypeId: entityTypes.testType.$id,
      temporalVersioning: {
        transactionTime: interval,
        decisionTime: interval,
      },
    },
    properties: { [extractBaseUrl(propertyTypes.name.$id)]: "World" },
  },
} as const;
// } as const satisfies Record<string, Entity<true>>;

type TestBlockType = keyof typeof blockEntityMap;

const DevApp: FunctionComponent = () => {
  const [testBlockType, setTestBlockType] = useState<TestBlockType>("react");

  const blockEntity = blockEntityMap[testBlockType];

  let blockDefinition;
  let blockType: "html" | "custom-element" | "react" | undefined;

  switch (testBlockType) {
    case "custom-element":
      blockDefinition = {
        customElement: {
          elementClass: TestCustomElementBlock,
          tagName: "test-custom-element-block",
        },
      };
      blockType = "custom-element";
      break;

    case "html-at-url":
      blockDefinition = {
        html: {
          url: "./test-html-block/block.html",
        },
      };
      blockType = "html";
      break;

    case "html-as-string":
      blockDefinition = {
        html: {
          source: testBlockString,
          url: new URL(
            "./test-html-block/block.html",
            window.location.toString(),
          ).toString(),
        },
      };
      blockType = "html";
      break;

    case "react":
    default:
      blockDefinition = {
        ReactComponent: TestReactBlock,
      };
      blockType = "react";
  }

  console.log({
    initialEntities: Object.values(blockEntityMap),
    blockEntity: blockEntity.metadata.recordId,
  });

  return (
    <>
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 60,
          zIndex: 1,
        }}
      >
        <label>
          <span style={{ fontSize: 14, marginRight: 8 }}>
            Select test block
          </span>
          <select
            value={testBlockType}
            onChange={(evt: ChangeEvent<HTMLSelectElement>) =>
              setTestBlockType(evt.target.value as TestBlockType)
            }
          >
            <option value="react">React</option>
            <option value="custom-element">Custom Element</option>
            <option value="html-at-url">HTML at URL</option>
            <option value="html-as-string">HTML as string</option>
          </select>
        </label>
      </div>

      <MockBlockDock
        blockDefinition={blockDefinition}
        blockEntityRecordId={{
          entityId: "test-entity-callout",
          editionId: "1970-01-01T00:00:00.000Z",
        }}
        blockInfo={{
          displayName: "Test Block",
          blockType: {
            entryPoint: blockType,
          },
          name: "test-block",
          protocol: "0.2",
          icon: "public/icon.svg",
          image: "public/image",
        }}
        blockProtocolApiKey={process.env.BLOCK_PROTOCOL_API_KEY}
        blockProtocolSiteHost={process.env.BLOCK_PROTOCOL_SITE_HOST}
        debug
        key={testBlockType} // completely reset the state when block type has changed
        initialData={{
          initialEntities: [
            {
              properties: {
                "https://blockprotocol.org/@hash/types/property-type/callout-block-emoji/":
                  "📢",
                "https://blockprotocol.org/@blockprotocol/types/property-type/textual-content/":
                  "Hello World!",
              },
              metadata: {
                recordId: {
                  entityId: "test-entity-callout",
                  editionId: "1970-01-01T00:00:00.000Z",
                },
                entityTypeId:
                  "https://blockprotocol.org/@hash/types/entity-type/callout-block/v/2",
                temporalVersioning: {
                  transactionTime: {
                    start: {
                      kind: "inclusive",
                      limit: "1970-01-01T00:00:00.000Z",
                    },
                    end: {
                      kind: "unbounded",
                    },
                  },
                  decisionTime: {
                    start: {
                      kind: "inclusive",
                      limit: "1970-01-01T00:00:00.000Z",
                    },
                    end: {
                      kind: "unbounded",
                    },
                  },
                },
              },
            },
          ],
          initialTemporalAxes: {
            pinned: {
              axis: "transactionTime",
              timestamp: "2023-04-18T11:15:05.518Z",
            },
            variable: {
              axis: "decisionTime",
              interval: {
                start: {
                  kind: "unbounded",
                },
                end: {
                  kind: "inclusive",
                  limit: "2023-04-18T11:15:05.518Z",
                },
              },
            },
          },
        }}
        includeDefaultMockData
        temporal
        simulateDatastoreLatency={{ min: 50, max: 200 }}
      />
    </>
  );
};

if (node) {
  createRoot(node).render(<DevApp />);
} else {
  throw new Error("Unable to find DOM element with id 'app'");
}

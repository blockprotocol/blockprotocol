import { extractBaseUri } from "@blockprotocol/type-system/slim";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { createRoot } from "react-dom/client";

import { MockBlockDock } from "../src";
import { entityTypes } from "../src/data/entity-types";
import { propertyTypes } from "../src/data/property-types";
import { TestCustomElementBlock } from "./test-custom-element-block";
import testBlockString from "./test-html-block/block.html?raw";
import { TestReactBlock } from "./test-react-block";

const node = document.getElementById("app");

const blockEntityMap = {
  react: {
    metadata: {
      recordId: {
        baseId: "entity-react",
        versionId: new Date().toISOString(),
      },
      entityTypeId: entityTypes.testType.$id,
    },
    properties: { [extractBaseUri(propertyTypes.name.$id)]: "World" },
  },
  "custom-element": {
    metadata: {
      recordId: {
        baseId: "entity-custom-element",
        versionId: new Date().toISOString(),
      },
      entityTypeId: entityTypes.testType.$id,
    },
    properties: { [extractBaseUri(propertyTypes.name.$id)]: "World" },
  },
  "html-at-url": {
    metadata: {
      recordId: {
        baseId: "entity-html-as-url",
        versionId: new Date().toISOString(),
      },
      entityTypeId: entityTypes.testType.$id,
    },
    properties: { [extractBaseUri(propertyTypes.name.$id)]: "World" },
  },
  "html-as-string": {
    metadata: {
      recordId: {
        baseId: "entity-html-as-string",
        versionId: new Date().toISOString(),
      },
      entityTypeId: entityTypes.testType.$id,
    },
    properties: { [extractBaseUri(propertyTypes.name.$id)]: "World" },
  },
} as const;
// } as const satisfies Record<string, Entity>;

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
        blockEntityRecordId={blockEntity.metadata.recordId}
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
        debug
        key={testBlockType} // completely reset the state when block type has changed
        initialEntities={Object.values(blockEntityMap)}
      />
    </>
  );
};

if (node) {
  createRoot(node).render(<DevApp />);
} else {
  throw new Error("Unable to find DOM element with id 'app'");
}

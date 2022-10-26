import { Entity } from "@blockprotocol/graph";
import { ChangeEvent, FunctionComponent, useState } from "react";
import { createRoot } from "react-dom/client";

import { MockBlockDock } from "../src";
import { TestCustomElementBlock } from "./test-custom-element-block";
import testBlockString from "./test-html-block/block.html?raw";
import { TestReactBlock } from "./test-react-block";

const node = document.getElementById("app");

type TestBlockType =
  | "react"
  | "custom-element"
  | "html-at-url"
  | "html-as-string";

const blockEntityMap = {
  react: {
    entityId: "entity-react",
    entityTypeId: "test-type-1",
    properties: { name: "World" },
  },
  "custom-element": {
    entityId: "entity-custom-element",
    entityTypeId: "test-type-1",
    properties: { name: "World" },
  },
  "html-at-url": {
    entityId: "entity-html-as-url",
    entityTypeId: "test-type-1",
    properties: { name: "World" },
  },
  "html-as-string": {
    entityId: "entity-html-as-string",
    entityTypeId: "test-type-1",
    properties: { name: "World" },
  },
} as Record<string, Entity>;

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
        blockEntity={blockEntity}
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
      />
    </>
  );
};

if (node) {
  createRoot(node).render(<DevApp />);
} else {
  throw new Error("Unable to find DOM element with id 'app'");
}

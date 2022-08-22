import { ChangeEvent, FunctionComponent, useState } from "react";
import { render } from "react-dom";

import { MockBlockDock } from "../src";
import { TestCustomElementBlock } from "./test-custom-element-block";
// eslint-disable-next-line import/no-unresolved
import testBlockString from "./test-html-block/block.html?raw";
import { TestReactBlock } from "./test-react-block";

const node = document.getElementById("app");

type TestBlockType =
  | "react"
  | "custom-element"
  | "html-at-url"
  | "html-as-string";

const DevApp: FunctionComponent = () => {
  const [testBlockType, setTestBlockType] = useState<TestBlockType>("react");

  const blockEntity = {
    entityId: `test-entity-1`,
    entityTypeId: "test-type-1",
    properties: { name: "World" },
  };

  let blockDefinition;

  switch (testBlockType) {
    case "custom-element":
      blockDefinition = {
        customElement: {
          elementClass: TestCustomElementBlock,
          tagName: "test-custom-element-block",
        },
      };
      break;

    case "html-at-url":
      blockDefinition = {
        html: {
          url: "./test-html-block/block.html",
        },
      };
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
      break;

    case "react":
    default:
      blockDefinition = {
        ReactComponent: TestReactBlock,
      };
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 16,
          zIndex: 100,
          display: "none",
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
        debug
        blockDefinition={blockDefinition}
        blockEntity={blockEntity}
      />
    </>
  );
};

render(<DevApp />, node);

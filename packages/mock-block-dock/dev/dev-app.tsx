import * as React from "react";
import * as ReactDOM from "react-dom";

import { MockBlockDock } from "../src";
import { TestCustomElementBlock } from "./test-custom-element-block";
// eslint-disable-next-line import/no-unresolved
import testBlockString from "./test-html-block/block.html?raw";
import { TestReactBlock } from "./test-react-block";

const node = document.getElementById("app");

const DevApp = () => {
  const [entityId, setEntityId] = React.useState(1);
  const [name, setName] = React.useState("World");

  const blockEntity = {
    entityId: `test-entity-${entityId}`,
    entityTypeId: "test-type-1",
    properties: { name },
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div
        style={{
          border: "1px solid black",
          padding: 15,
        }}
      >
        <h2>Update component props from outside the block</h2>
        <button type="button" onClick={() => setEntityId(entityId + 1)}>
          Increment Entity ID
        </button>
        <br />
        <br />
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={"blockEntity's name property"}
        />
      </div>
      <br />
      <h2>React</h2>
      <div style={{ border: "1px solid black", padding: 15 }}>
        <MockBlockDock
          debug
          blockDefinition={{ ReactComponent: TestReactBlock }}
          blockEntity={blockEntity}
        />
      </div>
      <h2>Custom Element</h2>
      <div style={{ border: "1px solid black", padding: 15 }}>
        <MockBlockDock
          debug
          blockDefinition={{
            customElement: {
              elementClass: TestCustomElementBlock,
              tagName: "test-custom-element-block",
            },
          }}
          blockEntity={blockEntity}
        />
      </div>
      <h2>HTML at URL</h2>
      <div style={{ border: "1px solid black", padding: 15 }}>
        <MockBlockDock
          debug
          blockDefinition={{
            html: {
              url: "./test-html-block/block.html",
            },
          }}
          blockEntity={blockEntity}
        />
      </div>
      <h2>HTML as string</h2>
      <div style={{ border: "1px solid black", padding: 15 }}>
        <MockBlockDock
          debug
          blockDefinition={{
            html: {
              source: testBlockString,
              url: new URL(
                "./test-html-block/block.html",
                window.location.toString(),
              ).toString(),
            },
          }}
          blockEntity={blockEntity}
        />
      </div>
    </div>
  );
};

ReactDOM.render(<DevApp />, node);

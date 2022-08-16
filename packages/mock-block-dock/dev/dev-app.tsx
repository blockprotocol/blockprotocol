import { FunctionComponent, useState } from "react";
import { render } from "react-dom";

import { MockBlockDock } from "../src";
import { TestCustomElementBlock } from "./test-custom-element-block";
// eslint-disable-next-line import/no-unresolved
import testBlockString from "./test-html-block/block.html?raw";
import { TestReactBlock } from "./test-react-block";

const node = document.getElementById("app");

const DevApp: FunctionComponent = () => {
  const [entityId, setEntityId] = useState(1);
  const [name, setName] = useState("World");
  const [readonly, setReadonly] = useState(false);

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
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/869 */}
        <label style={{ marginLeft: 20 }}>
          <input
            type="checkbox"
            onChange={(evt) => setReadonly(evt.target.checked)}
          />
          Read only mode
        </label>
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
          readonly={readonly}
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
          readonly={readonly}
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
          readonly={readonly}
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
          readonly={readonly}
        />
      </div>
    </div>
  );
};

render(<DevApp />, node);

import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom";

import { MockBlockDock } from "../src/mock-block-dock";
import { TestBlock } from "./test-block";

const node = document.getElementById("app");

const DevApp = () => {
  const [entityId, setEntityId] = useState(1);
  const [name, setName] = useState("World");

  return (
    <>
      <div style={{ border: "1px solid black", padding: 15 }}>
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
      <h2>The block</h2>
      <div style={{ border: "1px solid black", padding: 15 }}>
        <MockBlockDock>
          <TestBlock
            graph={{
              blockEntity: {
                entityId: `test-entity-${entityId}`,
                entityTypeId: "test-type-1",
                properties: { name },
              },
            }}
          />
        </MockBlockDock>
      </div>
    </>
  );
};

ReactDOM.render(<DevApp />, node);

import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom";

import { TestBlock } from "./TestBlock";
import { MockBlockDock } from "../src/MockBlockDock";

const node = document.getElementById("app");

const DevApp = () => {
  const [entityId, setEntityId] = useState(1);

  return (
    <>
      <button type="button" onClick={() => setEntityId(entityId + 1)}>
        Increment Entity ID
      </button>
      <br />
      <MockBlockDock>
        <TestBlock entityId={`test-entity-${entityId}`} name="World" />
      </MockBlockDock>
    </>
  );
};

ReactDOM.render(<DevApp />, node);

import * as React from "react";
import * as ReactDOM from "react-dom";
import { TestBlock } from "./TestBlock";
import { MockBlockDock } from "../src/MockBlockDock";

const node = document.getElementById("app");

const DevApp = () => (
  <MockBlockDock>
    <TestBlock entityId="test-entity-1" name="World" />
  </MockBlockDock>
);

ReactDOM.render(<DevApp />, node);

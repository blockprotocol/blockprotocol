import * as React from "react";
import * as ReactDOM from "react-dom";
import { TestBlock } from "./TestBlock";
import { MockBlockEmbedder } from "../src/MockBlockEmbedder";

const node = document.getElementById("app");

const DevApp = () => (
  <MockBlockEmbedder>
    <TestBlock entityId="test-entity-1" name="World" />
  </MockBlockEmbedder>
);

ReactDOM.render(<DevApp />, node);

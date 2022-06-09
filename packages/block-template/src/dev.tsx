/**
 * This is the entry point for developing and debugging.
 * This file is not bundled with the block during the build process.
 */
import { MockBlockDock } from "mock-block-dock";
import React from "react";
import ReactDOM from "react-dom";

import Component from "./index";

const node = document.getElementById("app");

const DevApp = () => (
  <MockBlockDock>
    <Component
      graph={{
        blockEntity: {
          entityId: "test-block-1",
          properties: { name: "World" },
        },
      }}
    />
  </MockBlockDock>
);

ReactDOM.render(<DevApp />, node);

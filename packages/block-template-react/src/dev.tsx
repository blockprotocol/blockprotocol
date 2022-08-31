/**
 * This is the entry point for developing and debugging.
 * This file is not bundled with the block during the build process.
 */
import { MockBlockDock } from "mock-block-dock";
import { createRoot } from "react-dom/client";

import packageJSON from "../package.json";
import Component from "./index";

const node = document.getElementById("app");

const DevApp = () => {
  return (
    <MockBlockDock
      blockDefinition={{ ReactComponent: Component }}
      blockEntity={{
        entityId: "test-block-1",
        properties: { name: "World" },
      }}
      blockInfo={packageJSON.blockprotocol}
      debug
    />
  );
};

createRoot(node).render(<DevApp />);

/**
 * This is the entry point for developing and debugging.
 * This file is not bundled with the block during the build process.
 */
import { MockBlockDock } from "mock-block-dock";
import { createRoot } from "react-dom/client";

import packageJson from "../package.json";
import ElementClass from "./index";

const node = document.getElementById("app");

const DevApp = () => {
  const tagName = packageJson.blockprotocol.blockType.tagName;
  if (!tagName) {
    throw new Error(
      "Please set a name for your custom element in package.json, under blockprotocol.blockType.tagName",
    );
  }

  return (
    <MockBlockDock
      blockDefinition={{
        customElement: {
          elementClass: ElementClass,
          tagName,
        },
      }}
      blockEntity={{
        entityId: "test-block-1",
        properties: { name: "World" },
      }}
      blockInfo={packageJson.blockprotocol}
      debug
    />
  );
};

if (node) {
  createRoot(node).render(<DevApp />);
} else {
  throw new Error("Unable to find DOM element with id 'app'");
}

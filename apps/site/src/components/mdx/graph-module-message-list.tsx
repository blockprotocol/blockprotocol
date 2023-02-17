import { ModuleDefinition } from "@blockprotocol/core";
import { graphModuleJson } from "@blockprotocol/graph/graph-module-json";

import { ModuleMessageList } from "../module-message-list";

// @todo generalize this - need a way of having the module JSON at build time without importing like this,
// e.g. pass a URL from the MDX component which is fetched at build time
export const GraphModuleMessageList = () => (
  <ModuleMessageList moduleDefinition={graphModuleJson as ModuleDefinition} />
);

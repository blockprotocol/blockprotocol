import { ModuleDefinition } from "@blockprotocol/core";
import { hookModuleJson } from "@blockprotocol/hook/hook-module-json";

import { ModuleMessageList } from "../module-message-list";

// @todo generalize this - need a way of having the module JSON at build time without importing like this,
// e.g. pass a URL from the MDX component which is fetched at build time
export const HookModuleMessageList = () => (
  <ModuleMessageList
    moduleDefinition={hookModuleJson as unknown as ModuleDefinition}
  />
);

import { ModuleDefinition } from "@blockprotocol/core";
import { serviceModuleJson } from "@blockprotocol/service/service-module-json";

import { ModuleMessageList } from "../../../module-message-list";

// @todo generalize this - need a way of having the module JSON at build time without importing like this,
// e.g. pass a URL from the MDX component which is fetched at build time
export const ServiceModuleMessageList = () => (
  <ModuleMessageList
    moduleDefinition={serviceModuleJson as unknown as ModuleDefinition}
  />
);

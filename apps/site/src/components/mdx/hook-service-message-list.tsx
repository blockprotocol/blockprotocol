import { ServiceDefinition } from "@blockprotocol/core";
import { hookServiceJson } from "@blockprotocol/hook/hook-service-json";

import { ServiceMessageList } from "../service-message-list.js";

// @todo generalize this - need a way of having the service JSON at build time without importing like this,
// e.g. pass a URL from the MDX component which is fetched at build time
export const HookServiceMessageList = () => (
  <ServiceMessageList
    serviceDefinition={hookServiceJson as ServiceDefinition}
  />
);

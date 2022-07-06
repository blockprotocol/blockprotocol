import { ServiceDefinition } from "@blockprotocol/core";
import GraphServiceJson from "@blockprotocol/graph/service-json";

import { ServiceMessageList } from "../service-message-list";

// @todo generalize this - need a way of having the service JSON at build time without importing like this,
// e.g. pass a URL from the MDX component which is fetched at build time
export const GraphServiceMessageList = () => (
  <ServiceMessageList
    serviceDefinition={GraphServiceJson as ServiceDefinition}
  />
);

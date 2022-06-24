export { CoreBlockHandler } from "./core-block-handler";
export { CoreEmbedderHandler } from "./core-embedder-handler";
export {
  assignBlockprotocolGlobals,
  markBlockScripts,
  renderHtmlBlock,
  teardownBlockprotocol,
} from "./html";
export { ServiceHandler } from "./service-handler";
export type {
  BlockMetadata,
  BlockMetadataRepository,
  BlockVariant,
  HtmlBlockDefinition,
  JsonArray,
  JsonObject,
  JsonValue,
  MessageCallback,
  MessageData,
  MessageError,
  ServiceDefinition,
  ServiceMessageDefinition,
  UnknownRecord,
} from "./types";

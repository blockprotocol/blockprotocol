export { CoreBlockHandler } from "./core-block-handler";
export { CoreEmbedderHandler } from "./core-embedder-handler";
export {
  assignBlockProtocolGlobals,
  markBlockScripts,
  renderHtmlBlock,
  teardownBlockProtocol,
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
  Message,
  MessageCallback,
  MessageData,
  MessageError,
  ServiceDefinition,
  ServiceMessageDefinition,
  UnknownRecord,
} from "./types";

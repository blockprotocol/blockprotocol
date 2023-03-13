export { CoreBlockHandler } from "./core-block-handler";
export { CoreEmbedderHandler } from "./core-embedder-handler";
export {
  assignBlockProtocolGlobals,
  markBlockScripts,
  renderHtmlBlock,
  teardownBlockProtocol,
} from "./html";
export { ModuleHandler } from "./module-handler";
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
  MessageReturn,
  ModuleDefinition,
  ModuleMessageDefinition,
  UnknownRecord,
} from "./types";

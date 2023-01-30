import { CoreHandler } from "./core-handler";
import { ServiceHandler } from "./service-handler";

// ---------------------------- UTILITIES ----------------------------- //

export type UnknownRecord = Record<string, unknown>;

export type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | JsonObject;

export type JsonObject = { [key: string]: JsonValue };

export interface JsonArray extends Array<JsonValue> {}

// -------------------------- BLOCK METADATA -------------------------- //

export type BlockVariant = {
  description?: string | null;
  icon?: string | null;
  name: string;
  properties: JsonObject;
  examples?: JsonObject[] | null;
};

export type BlockType = {
  entryPoint: "custom-element" | "html" | "react";
  tagName?: string;
};

export type BlockMetadataRepository =
  | {
      type: string;
      url: string;
      directory?: string;
    }
  | string;

export type BlockMetadata = {
  /**
   * The name of the author of the block
   */
  author?: string | null;
  /**
   * The type of block this is (e.g. custom element, React)
   */
  blockType: BlockType;
  /**
   * The default data used as the block's properties on first load - must comply with its schema
   */
  default?: JsonObject | null;
  /**
   * A short description of the block, to help users understand its capabilities
   */
  description?: string | null;
  /**
   * URL of a web socket that reports updates in locally developed blocks. To be used by EAs to auto reload.
   */
  devReloadEndpoint?: string | null;
  /**
   * The display name used for a block
   */
  displayName?: string | null;
  /**
   * A list of examples used to showcase a block's capabilities
   */
  examples?: JsonObject[] | null;
  /**
   * The dependencies a block relies on but expects the embedding application to provide, e.g. { "react": "^18.0.0" }
   */
  externals?: JsonObject;
  /**
   * An icon for the block, to be displayed when the user is selecting from available blocks (as well as elsewhere as appropriate, e.g. in a website listing the block).
   */
  icon?: string | null;
  /**
   * A preview image of the block for users to see it in action before using it. This would ideally have a 3:2 width:height ratio and be a minimum of 900x1170px.
   */
  image?: string | null;
  /**
   * The license the block is made available under (e.g. MIT).
   */
  license?: string | null;
  /**
   * A unique, slugified name for the block.
   */
  name: string;
  /**
   * The applicable block protocol version.
   */
  protocol: string;
  /**
   * Specify the place where your block's code lives. This is helpful for people who want to explore the source, or contribute to your block's development.
   */
  repository?: BlockMetadataRepository | null;
  /**
   * The path or URL to the block's schema (e.g. block-schema.json)
   */
  schema: string;
  /**
   * The path or URL to the entrypoint source file (e.g. index.html, index.js).
   */
  source: string;
  /**
   * A list which represents different variants of the block that the user can create.
   */
  variants?: BlockVariant[] | null;
  /**
   * The version of the block, which should use semantic versioning (@see https://semver.org/).
   */
  version: string;
};

export type MessageError<ErrorCode extends string> = {
  code: ErrorCode;
  message: string;
  extensions?: any;
};

/*
 * The payload sent via messages and passed to callbacks.
 *
 * @todo consider enforcing at least one of data or errors being sent
 */
export type MessageData<Data, ErrorCode extends string | null> = {
  data?: Data;
  errors?: ErrorCode extends string
    ? MessageError<ErrorCode>[]
    : undefined | [];
};

export type MessageContents<
  Data extends any = any,
  ErrorCode extends string | null = null,
> = {
  messageName: string;
} & MessageData<Data, ErrorCode>;

export interface Message extends MessageContents {
  // a unique id for the request
  requestId: string;
  // the name of the message expected to respond to this message, if any
  respondedToBy?: string;
  // the name of the service this message is sent under
  service: string;
  // the source of the message
  source: "block" | "embedder";
  // when the message was sent
  timestamp: string;
}

export type MessageCallback<
  InputData,
  InputErrorCode extends string | null,
  ReturnData extends any | null = null,
  ReturnErrorCode extends ReturnData extends null ? null : string | null = null,
> = {
  (messageData: MessageData<InputData, InputErrorCode>): ReturnData extends null
    ? void
    : Promise<MessageData<ReturnData, ReturnErrorCode>>;
};

export type GenericMessageCallback =
  | MessageCallback<any, string>
  | MessageCallback<any, string, any>
  | MessageCallback<any, null, any>
  | MessageCallback<any, null, any, string>;

export type MessageCallbacksByService = {
  [serviceName: string]: Map<string, GenericMessageCallback> | undefined;
};

export type EmbedderInitMessage = {
  [serviceName: string]: {
    [messageName: string]: any;
  };
};

export type SendMessageArgs = {
  partialMessage: MessageContents;
  requestId?: string;
  respondedToBy?: string;
  sender: CoreHandler | ServiceHandler;
};

type PromiseConstructorFnArgs = Parameters<
  ConstructorParameters<PromiseConstructorLike>[0]
>;

export type PromiseResolver = PromiseConstructorFnArgs[0];
export type PromiseRejecter = PromiseConstructorFnArgs[1];

export type ResponseSettlersByRequestIdMap = Map<
  string,
  {
    expectedResponseName: string;
    resolve: PromiseResolver;
    reject: PromiseRejecter;
  }
>;

export type ServiceMessageDefinition = {
  messageName: string;
  description: string;
  source: "embedder" | "block";
  data: Record<string, unknown>;
  sentOnInitialization?: boolean;
  errorCodes?: string[];
  respondedToBy?: string | null;
};

export type ServiceDefinition = {
  name: string;
  version: string;
  coreVersion: string;
  messages: ServiceMessageDefinition[];
};

export type HtmlBlockDefinition = {
  /**
   * The url to the block's HTML file entry point, e.g. `https://example.com/my-block.html`
   * The path is used as the base to resolve relative URLs in scripts/imports, and
   * is made available to blocks through `blockprotocol.getBlockUrl`. It is also
   * used by `renderHtmlBlock` to fetch the block's HTML source (the entry point),
   * if this is not provided.
   */
  url: string;
  /**
   * An HTML string equivalent to the file hosted at `url`.
   * If `source` is provided, `renderHtmlBlock` doesn't need to fetch the HTML
   * source, which can save time if you already have it available. `url` will
   * still be used to resolve relative URLs inside scripts.
   */
  source?: string;
};
export type CoreHandlerCallback = (handler: CoreHandler) => void;

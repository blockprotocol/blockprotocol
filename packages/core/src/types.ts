import { CoreHandler } from "./core-handler";
import { ServiceHandler } from "./service-handler";

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
}

export type MessageCallback<
  InputData,
  InputErrorCode extends string | null,
  ReturnData extends any | null = null,
  ReturnErrorCode extends ReturnData extends null ? null : string | null = null,
> = {
  (messageData: MessageData<InputData, InputErrorCode>): ReturnData extends null
    ? void
    :
        | MessageData<ReturnData, ReturnErrorCode>
        | Promise<MessageData<ReturnData, ReturnErrorCode>>;
};

export type GenericMessageCallback =
  | MessageCallback<any, string>
  | MessageCallback<any, string, any>
  | MessageCallback<any, null, any>
  | MessageCallback<any, null, any, string>;

export type MessageCallbacksByService = {
  [serviceName: string]:
    | {
        [messageName: string]: GenericMessageCallback | undefined;
      }
    | undefined;
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

export type BlockNameWithNamespace = `@${string}/${string}`;

export type UnknownBlock =
  | string
  | typeof HTMLElement
  | ((...props: any[]) => JSX.Element);

const textFromUrlRequestMessageType = "requestTextFromUrl";

export type TextFromUrlRequestMessage = {
  payload: { url: string };
  requestId: string;
  type: typeof textFromUrlRequestMessageType;
};

const textFromUrlResponseMessageType = "returnTextFromUrl";

export type TextFromUrlResponseMessage = {
  payload: { text: string };
  requestId: string;
  type: typeof textFromUrlResponseMessageType;
};

const objectHasKey = <K extends PropertyKey>(
  object: object,
  key: K,
): object is Record<K, unknown> => key in object;

const messageDataHasType = (
  message: MessageEvent<unknown>,
): message is MessageEvent & { data: { type: string } } =>
  typeof message.data === "object" &&
  message.data !== null &&
  objectHasKey(message.data, "type");

export const isTextFromUrlRequestMessage = (
  message: MessageEvent<unknown>,
): message is MessageEvent<TextFromUrlRequestMessage> =>
  messageDataHasType(message) &&
  message.data.type === textFromUrlRequestMessageType;

export const isTextFromUrlResponseMessage = (
  message: MessageEvent<unknown>,
): message is MessageEvent<TextFromUrlResponseMessage> =>
  messageDataHasType(message) &&
  message.data.type === textFromUrlResponseMessageType;

export const crossFrameRequestMap = new Map<
  string,
  { resolve: (text: string) => void; reject: (reason?: Error) => void }
>();

import { ReactElement } from "react";

export type BlockNameWithNamespace = `@${string}/${string}`;

export type UnknownBlock =
  | string
  | typeof HTMLElement
  | ((...props: any[]) => ReactElement);

const textFromUrlRequestMessageType = "requestTextFromUrl";

/**
 * A cross-frame request to retrieve text from a specified URL.
 * Expects a {@link TextFromUrlResponseMessage} in return.
 */
export type TextFromUrlRequestMessage = {
  payload: { url: string };
  requestId: string;
  type: typeof textFromUrlRequestMessageType;
};

const textFromUrlResponseMessageType = "returnTextFromUrl";

/**
 * A cross-frame response, returning text fetched from a URL.
 * Responding to a {@link TextFromUrlRequestMessage}
 */
export type TextFromUrlResponseMessage = {
  payload: { data: string; error?: string };
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

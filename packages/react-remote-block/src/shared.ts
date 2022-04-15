export type BlockNameWithNamespace = `@${string}/${string}`;

export type UnknownBlock =
  | string
  | typeof HTMLElement
  | ((...props: any[]) => JSX.Element);

export type TextFromUrlRequestMessage = {
  type: "";
};

export const crossFrameRequestMap = new Map<
  string,
  { resolve: (text: string) => void; reject: (reason?: Error) => void }
>();

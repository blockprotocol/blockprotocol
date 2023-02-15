import { MessageCallback, MessageReturn } from "@blockprotocol/core";
import { EntityId } from "@blockprotocol/graph";

export type HookResponse = {
  hookId: string;
};

export type HookData = {
  node: HTMLElement | null;
  type: string;
  path: (string | number)[];
  hookId: string | null;
  entityId: EntityId;
};

export type BlockHookMessageCallbacks = {};

export type EmbedderHookMessages<> = {};

export type HookError = "INVALID_INPUT" | "NOT_FOUND" | "NOT_IMPLEMENTED";

/**
 * @todo Generate these types from the JSON definition, to avoid manually keeping the JSON and types in sync
 */
export type EmbedderHookMessageCallbacks = {
  hook: MessageCallback<HookData, null, MessageReturn<HookResponse>, HookError>;
};

export type BlockHookMessages<
  Key extends keyof EmbedderHookMessageCallbacks = keyof EmbedderHookMessageCallbacks,
> = {
  [key in Key]: ({
    data,
    errors,
  }: Parameters<EmbedderHookMessageCallbacks[key]>[0]) => ReturnType<
    EmbedderHookMessageCallbacks[key]
  >;
};

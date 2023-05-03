import { MessageCallback, MessageReturn } from "@blockprotocol/core";
import { JsonObject, JsonValue } from "@blockprotocol/graph";

type ActionDefinition = {
  element: HTMLElement;
  label?: string;
  name: string;
  payloadSchema: JsonObject;
};

export type AvailableActionsData = {
  actions: ActionDefinition[];
};

export type ActionData = {
  element: HTMLElement;
  name: string;
  payload: JsonValue;
};

export type UpdateActionData = {
  element: HTMLElement;
  label: string;
  name: string;
};

export type ActionBlockMessages = {
  availableActions: MessageCallback<AvailableActionsData, null>;
  action: MessageCallback<ActionData, null>;
};

export type UpdateActionError = "INVALID_INPUT" | "NOT_FOUND";

export type ActionEmbedderMessages = {
  updateAction: MessageCallback<
    UpdateActionData,
    null,
    MessageReturn<AvailableActionsData>,
    UpdateActionError
  >;
};

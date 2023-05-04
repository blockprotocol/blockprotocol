import { MessageCallback, MessageReturn } from "@blockprotocol/core";
import { JsonObject, JsonValue } from "@blockprotocol/graph";

export type ActionDefinition = {
  elementId: string;
  label?: string;
  actionName: string;
  payloadSchema: JsonObject;
};

export type AvailableActionsData = {
  actions: ActionDefinition[];
};

export type ActionData = {
  elementId: string;
  actionName: string;
  payload: JsonValue;
};

export type UpdateActionData = {
  elementId: string;
  actionName: string;
  label: string;
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

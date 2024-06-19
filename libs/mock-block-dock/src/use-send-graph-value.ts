import {
  GraphBlockMessageCallbacks as GraphBlockMessageCallbacksNonTemporal,
  GraphEmbedderHandler as GraphEmbedderHandlerNonTemporal,
} from "@blockprotocol/graph";
import {
  GraphBlockMessageCallbacks as GraphBlockMessageCallbacksTemporal,
  GraphEmbedderHandler as GraphEmbedderHandlerTemporal,
} from "@blockprotocol/graph/temporal";
import { useEffect, useRef } from "react";

type GraphValue<Temporal extends boolean> = Temporal extends true
  ? {
      [Key in keyof GraphBlockMessageCallbacksTemporal]: {
        valueName: Key;
        value: Parameters<GraphBlockMessageCallbacksTemporal[Key]>[0]["data"];
      };
    }[keyof GraphBlockMessageCallbacksTemporal]
  : {
      [Key in keyof GraphBlockMessageCallbacksNonTemporal]: {
        valueName: Key;
        value: Parameters<
          GraphBlockMessageCallbacksNonTemporal[Key]
        >[0]["data"];
      };
    }[keyof GraphBlockMessageCallbacksNonTemporal];

type UseSendGraphValueArgs<Temporal extends boolean> = {
  graphModule:
    | (Temporal extends true
        ? GraphEmbedderHandlerTemporal
        : GraphEmbedderHandlerNonTemporal)
    | null;
} & GraphValue<Temporal>;

export const useSendGraphValue = <Temporal extends boolean>({
  graphModule,
  value,
  valueName,
}: UseSendGraphValueArgs<Temporal>) => {
  const sentValue = useRef(value);
  const sentInitially = useRef(false);

  useEffect(() => {
    if (
      graphModule &&
      (!sentInitially.current ||
        JSON.stringify(value) !== JSON.stringify(sentValue.current))
    ) {
      graphModule[valueName]({ data: value as any }); // @todo how to maintain the union GraphValue is initially set to?
      sentInitially.current = true;
      sentValue.current = value;
    }
  }, [graphModule, value, valueName]);
};

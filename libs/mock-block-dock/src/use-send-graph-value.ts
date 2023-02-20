import {
  BlockGraphMessageCallbacks as BlockGraphMessageCallbacksNonTemporal,
  GraphEmbedderHandler as GraphEmbedderHandlerNonTemporal,
} from "@blockprotocol/graph";
import {
  BlockGraphMessageCallbacks as BlockGraphMessageCallbacksTemporal,
  GraphEmbedderHandler as GraphEmbedderHandlerTemporal,
} from "@blockprotocol/graph/temporal";
import { useEffect, useRef } from "react";

type GraphValue<Temporal extends boolean> = Temporal extends true
  ? {
      [Key in keyof BlockGraphMessageCallbacksTemporal]: {
        valueName: Key;
        value: Parameters<BlockGraphMessageCallbacksTemporal[Key]>[0]["data"];
      };
    }[keyof BlockGraphMessageCallbacksTemporal]
  : {
      [Key in keyof BlockGraphMessageCallbacksNonTemporal]: {
        valueName: Key;
        value: Parameters<
          BlockGraphMessageCallbacksNonTemporal[Key]
        >[0]["data"];
      };
    }[keyof BlockGraphMessageCallbacksNonTemporal];

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

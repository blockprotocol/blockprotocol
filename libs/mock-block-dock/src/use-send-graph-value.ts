import {
  BlockGraphMessageCallbacks,
  GraphEmbedderHandler,
} from "@blockprotocol/graph";
import { useEffect, useRef } from "react";

type GraphValue = {
  [Key in keyof BlockGraphMessageCallbacks<true>]: {
    valueName: Key;
    value: Parameters<BlockGraphMessageCallbacks<true>[Key]>[0]["data"];
  };
}[keyof BlockGraphMessageCallbacks<true>];

type UseSendGraphValueArgs = {
  graphModule: GraphEmbedderHandler<true> | null;
} & GraphValue;

export const useSendGraphValue = ({
  graphModule,
  value,
  valueName,
}: UseSendGraphValueArgs) => {
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

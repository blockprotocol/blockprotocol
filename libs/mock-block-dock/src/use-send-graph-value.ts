import {
  BlockGraphMessageCallbacks,
  GraphEmbedderHandler,
} from "@blockprotocol/graph";
import { useEffect, useRef } from "react";

type GraphValue = {
  [Key in keyof BlockGraphMessageCallbacks]: {
    valueName: Key;
    value: Parameters<BlockGraphMessageCallbacks[Key]>[0]["data"];
  };
}[keyof BlockGraphMessageCallbacks];

type UseSendGraphValueArgs = {
  graphService?: GraphEmbedderHandler | null;
} & GraphValue;

export const useSendGraphValue = ({
  graphService,
  value,
  valueName,
}: UseSendGraphValueArgs) => {
  const sentValue = useRef(value);
  const sentInitially = useRef(false);

  useEffect(() => {
    if (
      graphService &&
      (!sentInitially.current ||
        JSON.stringify(value) !== JSON.stringify(sentValue.current))
    ) {
      graphService[valueName]({ data: value as any }); // @todo how to maintain the union GraphValue is initially set to?
      sentInitially.current = true;
      sentValue.current = value;
    }
  }, [graphService, value, valueName]);
};

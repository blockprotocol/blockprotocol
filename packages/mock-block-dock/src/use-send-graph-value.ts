import {
  BlockGraphMessageCallbacks,
  GraphEmbedderHandler,
} from "@blockprotocol/graph";
import { useEffect, useRef } from "react";

import { usePrevious } from "./use-previous";

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
  const sentOnce = useRef(false);
  const previousValue = usePrevious(value);

  useEffect(() => {
    if (
      graphService &&
      (!sentOnce.current ||
        JSON.stringify(value) !== JSON.stringify(previousValue))
    ) {
      graphService[valueName](value as any); // @todo how to maintain the union GraphValue is initially set to?
      if (!sentOnce.current) {
        sentOnce.current = true;
      }
    }
  }, [graphService, value, valueName]);
};

import { DependencyList, useCallback } from "react";

import { randomNumberFromRange } from "../../util";

type AnyAsyncFunction = (...args: any[]) => Promise<any>;

export const useCallbackWithLatency = <T extends AnyAsyncFunction>(
  callback: T,
  deps: DependencyList,
  simulateDatastoreLatency?: { min: number; max: number },
): T => {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- it's not smart enough to deal with the cast
  return useCallback<T>(
    (async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
      if (simulateDatastoreLatency) {
        const waitFor = randomNumberFromRange(
          simulateDatastoreLatency.min,
          simulateDatastoreLatency.max,
        );
        await new Promise((resolve) => {
          setTimeout(resolve, waitFor);
        });
      }
      return await callback(...args);
    }) as T,
    [callback, ...deps, simulateDatastoreLatency],
  );
};

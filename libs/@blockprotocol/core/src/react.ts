import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ServiceHandler } from "./service-handler";
import { GenericMessageCallback } from "./types";

type ServiceConstructor<T extends ServiceHandler> = {
  new (arg: {
    callbacks?: Record<string, GenericMessageCallback>;
    element?: HTMLElement | null;
  }): T;
};

export const useServiceConstructor = <T extends ServiceHandler>({
  Handler,
  constructorArgs,
  ref,
}: {
  Handler: ServiceConstructor<T>;
  constructorArgs?: { callbacks?: Record<string, GenericMessageCallback> };
  ref: RefObject<HTMLElement>;
}) => {
  const previousRef = useRef<HTMLElement | null>(null);
  const initialisedRef = useRef(false);

  const [service, setService] = useState<T>(
    () => new Handler(constructorArgs ?? {}),
  );

  const previousCallbacks = useRef<Record<
    string,
    GenericMessageCallback
  > | null>(null);

  // Using a layout effect to ensure callbacks are updated as early as possible,
  // to avoid any potential timing bugs
  useLayoutEffect(() => {
    if (previousCallbacks.current) {
      service.removeCallbacks(previousCallbacks.current);
    }

    previousCallbacks.current = constructorArgs?.callbacks ?? null;

    if (constructorArgs?.callbacks) {
      service.registerCallbacks(constructorArgs.callbacks);
    }
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps -- will not loop & we don't want to reconstruct on other args
  useEffect(() => {
    if (ref.current === previousRef.current) {
      return;
    }

    if (previousRef.current) {
      service.destroy();
    }

    previousRef.current = ref.current;

    if (ref.current) {
      if (!initialisedRef.current) {
        service.initialize(ref.current);
      } else {
        setService(
          new Handler({
            element: ref.current,
            ...constructorArgs,
          }),
        );
      }

      initialisedRef.current = true;
    }
  });

  return service;
};

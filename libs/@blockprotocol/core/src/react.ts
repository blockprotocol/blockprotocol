import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

import type { ModuleHandler } from "./module-handler.js";
import type { GenericMessageCallback } from "./types.js";

type ModuleConstructor<T extends ModuleHandler> = {
  new (arg: {
    callbacks?: Record<string, GenericMessageCallback>;
    element?: HTMLElement | null;
  }): T;
};

export const useModuleConstructor = <T extends ModuleHandler>({
  Handler,
  constructorArgs,
  ref,
}: {
  Handler: ModuleConstructor<T>;
  constructorArgs?: Omit<
    ConstructorParameters<ModuleConstructor<T>>[0],
    "element"
  >;
  ref: RefObject<HTMLElement | null>;
}) => {
  const previousRef = useRef<HTMLElement | null>(null);
  const initialisedRef = useRef(false);

  const [module, setModule] = useState<T>(
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
      module.removeCallbacks(previousCallbacks.current);
    }

    previousCallbacks.current = constructorArgs?.callbacks ?? null;

    if (constructorArgs?.callbacks) {
      module.registerCallbacks(constructorArgs.callbacks);
    }
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps -- will not loop & we don't want to reconstruct on other args
  useEffect(() => {
    if (ref.current === previousRef.current) {
      return;
    }

    if (previousRef.current) {
      module.destroy();
    }

    previousRef.current = ref.current;

    if (ref.current) {
      if (!initialisedRef.current) {
        initialisedRef.current = true;
        module.initialize(ref.current);
      } else {
        setModule(
          new Handler({
            element: ref.current,
            ...constructorArgs,
          }),
        );
      }
    }
  });

  return module;
};

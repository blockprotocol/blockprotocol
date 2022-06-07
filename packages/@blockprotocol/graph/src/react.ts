import { RefObject, useLayoutEffect, useState } from "react";

import { GraphBlockHandler, GraphEmbedderHandler } from "./index";

export const useGraphBlockService = ({
  callbacks,
  ref,
}: {
  callbacks: ConstructorParameters<typeof GraphBlockHandler>[0]["callbacks"];
  ref: RefObject<HTMLElement>;
}) => {
  const [graphService, setGraphService] = useState<GraphBlockHandler>();
  useLayoutEffect(() => {
    if (ref.current) {
      setGraphService(
        new GraphBlockHandler({ callbacks, element: ref.current }),
      );
    }
  }, [callbacks, ref]);

  return { graphService };
};

export const useGraphEmbedderService = ({
  ref,
  ...rest
}: {
  ref: RefObject<HTMLElement>;
} & Omit<ConstructorParameters<typeof GraphEmbedderHandler>[0], "element">) => {
  const [graphService, setGraphService] = useState<GraphEmbedderHandler>();
  useLayoutEffect(() => {
    if (ref.current) {
      setGraphService(
        new GraphEmbedderHandler({
          element: ref.current,
          ...rest,
        }),
      );
    }
  }, [ref, rest]);

  return { graphService };
};

import { BlockComponent, useGraphBlockService } from "@blockprotocol/graph";
import { useHookBlockService } from "@blockprotocol/hook";
import * as React from "react";
import { useCallback, useEffect, useRef } from "react";

type AppProps = {
  name: string;
};

// @todo simplify this
export const TestReactBlock: BlockComponent<AppProps> = ({ graph }) => {
  const {
    blockEntity: { entityId, properties },
  } = graph;
  const blockRef = useRef<HTMLDivElement>(null);

  const { graphService } = useGraphBlockService(blockRef);
  const { hookService } = useHookBlockService(blockRef);
  const nodeRef = useRef<HTMLHeadingElement>(null);

  const callHookService = useCallback(
    (node: HTMLElement | null) => {
      if (node && hookService) {
        console.log(node, hookService);
        hookService.node(node).catch((err: unknown) => {
          console.error(err);
        });
      }
    },
    [hookService],
  );

  // @todo aborting?
  useEffect(() => {
    if (hookService) {
      let nodeToRemove: HTMLElement | null = null;

      callHookService(nodeRef.current);

      hookService
        .render(entityId)
        .then((node) => {
          nodeToRemove?.remove();
          // @todo why isn't node typed properly
          nodeToRemove = node as any;
          blockRef.current!.appendChild(nodeToRemove!);
        })
        .catch((err) => {
          console.error(err);
        });

      return () => {
        nodeToRemove?.remove();
      };
    }
  }, [hookService, entityId, callHookService]);

  const callHookServiceLater = useCallback(
    (node: HTMLElement | null) => {
      queueMicrotask(() => {
        callHookService(node);
      });
    },
    [callHookService],
  );

  return (
    <div ref={blockRef}>
      <h1>
        Hello {properties.name}! The id of this block is {entityId}
      </h1>
      {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
      <h2 ref={callHookServiceLater} />
      <input
        type="text"
        placeholder="This block's entity's 'name' property"
        value={properties.name}
        onChange={async (event) => {
          try {
            const { data, errors } = await graphService!.updateEntity({
              data: {
                entityId,
                properties: { name: event.target.value },
              },
            });
            // eslint-disable-next-line no-console
            console.log("Return from updateEntity request: ", { data, errors });
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Error calling updateEntity: ${err}`);
          }
        }}
      />
    </div>
  );
};

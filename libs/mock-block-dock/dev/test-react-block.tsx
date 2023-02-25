import { extractBaseUrl } from "@blockprotocol/graph";
import {
  type BlockComponent,
  useGraphBlockModule,
} from "@blockprotocol/graph/react";
import { getRoots } from "@blockprotocol/graph/stdlib";
import { useHook, useHookBlockModule } from "@blockprotocol/hook/react";
import {
  MapboxSuggestAddressResponseData,
  OpenAICompleteTextResponseData,
} from "@blockprotocol/service";
import { useServiceBlockModule } from "@blockprotocol/service/react";
import { FormEvent, useCallback, useMemo, useRef, useState } from "react";

import { propertyTypes } from "../src/data/property-types";

export const TestReactBlock: BlockComponent = ({ graph }) => {
  const { blockEntitySubgraph, readonly } = graph;
  const blockRef = useRef<HTMLDivElement>(null);
  const hookRef = useRef<HTMLDivElement>(null);

  const blockEntity = useMemo(() => {
    return blockEntitySubgraph ? getRoots(blockEntitySubgraph)[0]! : undefined;
  }, [blockEntitySubgraph]);

  const { graphModule } = useGraphBlockModule(blockRef);

  const { serviceModule } = useServiceBlockModule(blockRef);

  const { hookModule } = useHookBlockModule(blockRef);

  const [openaiCompleteTextPrompt, setOpenaiCompleteTextPrompt] =
    useState<string>("");
  const [openaiCompleteTextResponse, setOpenaiCompleteTextResponse] = useState<
    OpenAICompleteTextResponseData | undefined | null
  >(null);

  const [mapboxSuggestSearchText, setMapboxSuggestSearchText] =
    useState<string>("");
  const [mapboxSuggestResponse, setMapboxSuggestResponse] = useState<
    MapboxSuggestAddressResponseData | undefined | null
  >(null);

  useHook(
    hookModule,
    hookRef,
    "text",
    blockEntity?.metadata.recordId.entityId ?? "",
    [extractBaseUrl(propertyTypes.description.$id)],
    () => {
      throw new Error(
        "Fallback called – dock is not correctly handling text hook.",
      );
    },
  );

  const handleOpenaiCompleteTextSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const response = await serviceModule.openaiCompleteText({
        data: {
          prompt: openaiCompleteTextPrompt,
          model: "text-davinci-003",
        },
      });

      if (response.data) {
        setOpenaiCompleteTextResponse(response.data);
      }
    },
    [openaiCompleteTextPrompt, serviceModule],
  );

  const handleMapboxSuggestSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const response = await serviceModule.mapboxSuggestAddress({
        data: {
          searchText: mapboxSuggestSearchText,
          optionsArg: { sessionToken: "block" },
        },
      });

      if (response.data) {
        setMapboxSuggestResponse(response.data);
      }
    },
    [mapboxSuggestSearchText, serviceModule],
  );

  if (readonly) {
    return (
      <div ref={blockRef}>
        <h1>
          Hello{" "}
          {
            blockEntity?.properties[extractBaseUrl(propertyTypes.name.$id)] as
              | string
              | undefined
          }
          ! The id of this block is {blockEntity?.metadata.recordId.entityId}
        </h1>
        <h2>Block-handled name display</h2>
        <p style={{ marginBottom: 30 }}>
          {
            blockEntity?.properties[extractBaseUrl(propertyTypes.name.$id)] as
              | string
              | undefined
          }
        </p>
        <h2>Hook-handled description display</h2>
        <div ref={hookRef} />
      </div>
    );
  }

  return (
    <div ref={blockRef}>
      <h1>
        <>
          Hello{" "}
          {blockEntity?.properties[extractBaseUrl(propertyTypes.name.$id)]}! The
          id of this block is {blockEntity?.metadata.recordId.entityId}
        </>
      </h1>
      <h2>Block-handled name editing</h2>
      <input
        type="text"
        placeholder="This block's entity's 'name' property"
        value={
          blockEntity?.properties[extractBaseUrl(propertyTypes.name.$id)] as
            | string
            | undefined
        }
        onChange={async (event) => {
          if (!blockEntity) {
            return;
          }
          try {
            const { data, errors } = await graphModule.updateEntity({
              data: {
                entityId: blockEntity.metadata.recordId.entityId,
                entityTypeId: blockEntity.metadata.entityTypeId,
                properties: {
                  ...blockEntity.properties,
                  [extractBaseUrl(propertyTypes.name.$id)]: event.target.value,
                },
                leftToRightOrder: blockEntity.linkData?.leftToRightOrder,
                rightToLeftOrder: blockEntity.linkData?.rightToLeftOrder,
              },
            });
            // eslint-disable-next-line no-console
            console.log("Return from updateEntity request: ", {
              data,
              errors,
            });
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Error calling updateEntity: ${err}`);
          }
        }}
      />
      <h2>Hook-handled description editing</h2>
      <div ref={hookRef} />
      <form onSubmit={handleOpenaiCompleteTextSubmit}>
        <label>
          OpenAI Complete Text API request
          <br />
          <input
            type="text"
            value={openaiCompleteTextPrompt}
            onChange={({ target }) => setOpenaiCompleteTextPrompt(target.value)}
          />
        </label>
        <button type="submit" disabled={!openaiCompleteTextPrompt}>
          Suggest
        </button>
      </form>
      {openaiCompleteTextResponse === undefined ? (
        <p>Loading...</p>
      ) : openaiCompleteTextResponse ? (
        <p>{openaiCompleteTextResponse.choices[0]!.text}</p>
      ) : null}
      <form onSubmit={handleMapboxSuggestSubmit}>
        <label>
          Mapbox Suggest API request
          <br />
          <input
            type="text"
            value={mapboxSuggestSearchText}
            onChange={({ target }) => setMapboxSuggestSearchText(target.value)}
          />
        </label>
        <button type="submit" disabled={!mapboxSuggestSearchText}>
          Suggest
        </button>
      </form>
      {mapboxSuggestResponse === undefined ? (
        <p>Loading...</p>
      ) : mapboxSuggestResponse ? (
        <ul>
          {mapboxSuggestResponse.suggestions.map(({ place_name }, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={`${place_name}${i}`}>{place_name}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

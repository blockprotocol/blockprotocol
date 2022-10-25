import {
  EmbedderGraphMessageCallbacks,
  EntityType,
} from "@blockprotocol/graph";
import { Box, Typography } from "@mui/material";
import debounce from "lodash/debounce.js";
import get from "lodash/get.js";
import {
  createContext,
  FunctionComponent,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { tw } from "twind";

import { JsonSchema } from "../../../lib/json-schema.js";
import { Link } from "../../link.js";
import { TextInputOrDisplay } from "./inputs.js";
import {
  schemaEditorReducer,
  SchemaEditorReducerAction,
} from "./schema-editor-reducer.js";
import { SchemaPropertiesTable } from "./schema-properties-table.js";

// @todo implement subschema handling (or remove this code)
// import { SubSchemaItem } from './sub-schema-item';
// import { Button } from '../../button';

export const SchemaOptionsContext = createContext<{
  availableEntityTypes: EntityType[];
  selectedSchema: JsonSchema;
  subSchemas: [string, JsonSchema][];
  generateAbsoluteSchemaLink: ($ref: string) => ReactElement;
} | null>(null);

type JsonSchemaEditorProps = {
  entityTypeId: string;
  schema: JsonSchema;
  subSchemaReference?: string;
} & Pick<EmbedderGraphMessageCallbacks, "aggregateEntityTypes"> &
  Partial<Pick<EmbedderGraphMessageCallbacks, "updateEntityType">>;

export const SchemaEditor: FunctionComponent<JsonSchemaEditorProps> = ({
  aggregateEntityTypes,
  entityTypeId,
  schema: possiblyStaleDbSchema,
  subSchemaReference,
  updateEntityType,
}) => {
  const [availableEntityTypes, setAvailableEntityTypes] = useState<
    EntityType[] | undefined
  >(undefined);

  useEffect(() => {
    if (aggregateEntityTypes) {
      aggregateEntityTypes({ data: { includeOtherTypesInUse: true } })
        .then(({ data }) => setAvailableEntityTypes(data?.results ?? []))
        .catch((err) =>
          // eslint-disable-next-line no-console -- TODO: consider using logger
          console.error(`Error fetching entity type options: ${err.message}`),
        );
    }
  }, [aggregateEntityTypes]);

  // The user will be working with a draft in local state, to enable optimistic UI and handle fast/competing updates
  const [workingSchemaDraft, dispatch] = useReducer(
    schemaEditorReducer,
    possiblyStaleDbSchema,
  );

  const debouncedUpdate = useMemo(
    () =>
      debounce<EmbedderGraphMessageCallbacks["updateEntityType"]>((...args) => {
        if (!updateEntityType) {
          throw new Error(
            "updateEntityType function not provided. Schema cannot be updated.",
          );
        }
        return updateEntityType(...args);
      }, 500),
    [updateEntityType],
  );

  useEffect(() => {
    if (!entityTypeId) {
      throw new Error("entityId not provided. Schema cannot be updated.");
    }
    if (
      JSON.stringify(workingSchemaDraft) ===
      JSON.stringify(possiblyStaleDbSchema)
    ) {
      return;
    }
    // Send updates to the API periodically when the draft is updated
    debouncedUpdate({
      data: {
        entityTypeId,
        schema: workingSchemaDraft as EntityType["schema"],
      },
    })?.catch((err) => {
      // eslint-disable-next-line no-console -- TODO: consider using logger
      console.error(`Error updating schema: ${err.message}`);
      throw err;
    });
  }, [
    debouncedUpdate,
    entityTypeId,
    possiblyStaleDbSchema,
    workingSchemaDraft,
  ]);

  useEffect(
    () => () => {
      // fire off any pending updates
      debouncedUpdate.flush()?.catch((err) => {
        // eslint-disable-next-line no-console -- TODO: consider using logger
        console.error(`Error updating schema: ${err.message}`);
        throw err;
      });
    },
    [debouncedUpdate],
  );

  // Strip the leading #/ and replace namespace separator / with dots, for use in lodash get/set methods
  const pathToSubSchema = subSchemaReference
    ?.replace(/^#\//, "")
    .replace(/\//g, ".");

  const dispatchSchemaUpdate = useCallback(
    (action: SchemaEditorReducerAction) => {
      if (pathToSubSchema && action.type !== "addSubSchema") {
        // don't support sub-schemas with their own sub-schemas for now. the UI doesn't handle it
        // eslint-disable-next-line no-param-reassign
        action.payload.pathToSubSchema = pathToSubSchema;
      }
      dispatch(action);
    },
    [dispatch, pathToSubSchema],
  );

  // @todo handle subschemas properly
  const subSchemas = Object.entries(
    workingSchemaDraft.$defs ?? workingSchemaDraft.definitions ?? [],
  );

  const schema$id = workingSchemaDraft.$id;

  /**
   * Generate a link for an absolute URI to a schema (or part of a schema), for a given value for $ref
   */
  const generateAbsoluteSchemaLink = useCallback(
    ($ref: string) => {
      const baseUrl = schema$id?.startsWith("http")
        ? new URL(schema$id).origin
        : undefined;

      if (!baseUrl && ($ref.startsWith("#") || $ref.startsWith("/"))) {
        throw new Error(
          `Cannot resolve relative $ref '${$ref} as the schema has no absolute $id to resolve it against.`,
        );
      }

      let schemaLinkPath = "";
      /**
       * @todo catch links to schemas served from outside blockprotocol.org, and instead of opening their off-site pages,
       *    fetch them and load them into our viewer. Will need to update relative approaches too.
       */
      if ($ref.startsWith("#")) {
        /**
         * This is a relative link to a sub-schema of this same schema
         * @see https://json-schema.org/understanding-json-schema/structuring.html#json-pointer
         */
        schemaLinkPath = schema$id + $ref;
      } else if ($ref.startsWith("/")) {
        /**
         * This is a relative link to another schema to be resolved against the base URL of this schema.
         * @see https://json-schema.org/understanding-json-schema/structuring.html#ref
         */
        schemaLinkPath = baseUrl + $ref;
      } else if ($ref.startsWith("http")) {
        schemaLinkPath = $ref;
      } else {
        /**
         * This could be a property name for an object defined in the tree of the schema or a sub-schema within it.
         * Really these should instead be defined under $defs and referenced as such, but they might exist.
         */
        schemaLinkPath = `${
          schema$id + (subSchemaReference || "#")
        }/properties/${$ref}`;
      }

      return (
        <Link href={schemaLinkPath}>
          <a>
            <strong>{$ref.replace(/#\/\$defs\//g, "")}</strong>
          </a>
        </Link>
      );
    },
    [schema$id, subSchemaReference],
  );

  /**
   * @todo deal with $anchors https://json-schema.org/understanding-json-schema/structuring.html#anchor
   */
  const selectedSchema: JsonSchema = pathToSubSchema
    ? get(workingSchemaDraft, pathToSubSchema)
    : workingSchemaDraft;

  const schemaOptions = useMemo(
    () => ({
      availableEntityTypes: availableEntityTypes ?? [],
      generateAbsoluteSchemaLink,
      selectedSchema,
      subSchemas,
    }),
    [
      availableEntityTypes,
      generateAbsoluteSchemaLink,
      selectedSchema,
      subSchemas,
    ],
  );

  const { description } = selectedSchema;

  const readonly = !updateEntityType || !entityTypeId;

  // @todo implement subschema handling (or remove this code)
  // const addSubSchema = (newSubSchemaName: string) =>
  //   dispatchSchemaUpdate({
  //     type: "addSubSchema",
  //     payload: { newSubSchemaName },
  //   });
  //
  // const [newSubSchemaName, setNewSubSchemaName] = useState("");

  // const onNewSubSchemaFormSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //
  //   if (!newSubSchemaName.trim()) {
  //     return;
  //   }
  //
  //   addSubSchema(newSubSchemaName);
  //   setNewSubSchemaName("");
  // };

  const updateSchemaDescription = (newSchemaDescription: string) => {
    return dispatchSchemaUpdate({
      type: "updateSchemaDescription",
      payload: { newSchemaDescription },
    });
  };

  return (
    <div>
      <section>
        <div className={tw`flex items-center`}>
          {subSchemaReference ? (
            <Typography variant="bpHeading4" component="h3">
              {` > ${subSchemaReference.split("/").pop()}`}
            </Typography>
          ) : null}
        </div>
        {!readonly && description != null && (
          <div className={tw`mb-8`}>
            <Typography variant="bpSmallCopy">
              <strong>Schema description</strong>
            </Typography>
            <TextInputOrDisplay
              placeholder="Describe your schema"
              readonly={readonly}
              updateText={updateSchemaDescription}
              value={description ?? ""}
              updateOnBlur
            />
          </div>
        )}
        <Box sx={{ overflowX: "auto" }}>
          {!availableEntityTypes ? (
            "Loading..."
          ) : (
            <SchemaOptionsContext.Provider value={schemaOptions}>
              <SchemaPropertiesTable
                selectedSchema={selectedSchema}
                readonly={readonly}
                dispatchSchemaUpdate={dispatchSchemaUpdate}
              />
            </SchemaOptionsContext.Provider>
          )}
        </Box>
      </section>

      {/** @todo handle subschemas or remove this code
       {updateEntityTypes || subSchemas.length > 0 ? (
        <section className={tw`mt-8`}>
          <h2>Sub-schemas in {title}</h2>
          {subSchemas.map((subSchema) => (
            <SubSchemaItem
              dispatchSchemaUpdate={dispatchSchemaUpdate}
              key={subSchema[0]}
              subSchema={subSchema}
              subSchemaReference={subSchemaReference}
              workingSchemaDraft={workingSchemaDraft}
            />
          ))}
          {updateEntityTypes ? (
            <div className={tw`mt-8`}>
              <div className={tw`text-uppercase font-bold text-sm mr-12 mb-1`}>
                New sub-schema
              </div>
              <form onSubmit={onNewSubSchemaFormSubmit}>
                <TextInputOrDisplay
                  required
                  placeholder="MySubSchema"
                  readonly={false}
                  updateText={(value) => setNewSubSchemaName(value)}
                  value={newSubSchemaName}
                />
                <br />
                <Button type="submit" squared>
                  Create Sub-schema
                </Button>
              </form>
            </div>
          ) : null}
        </section>
      ) : null}
       * */}
    </div>
  );
};

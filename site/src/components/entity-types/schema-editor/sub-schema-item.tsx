import { useRouter } from "next/router";
import { FunctionComponent, useContext, useState } from "react";
import { tw } from "twind";

import { JsonSchema } from "../../../lib/json-schema";
import { Button } from "../../button";
import { ConfirmationAlert } from "../../confirmation-alert";
import { SchemaOptionsContext } from "./schema-editor";
import {
  getSubschemaDependentProperties,
  SchemaEditorReducerAction,
} from "./schema-editor-reducer";

type SubSchemaItemProps = {
  dispatchSchemaUpdate: (action: SchemaEditorReducerAction) => void;
  subSchema: [string, JsonSchema];
  subSchemaReference: string | undefined;
  workingSchemaDraft: JsonSchema;
};

type AlertState = {
  open: boolean;
  subSchemaUsedInProperties: Array<string>;
};

/**
 * Allows the user to select and delete a sub-schema
 * Currently unused
 * @todo use or remove this
 */
export const SubSchemaItem: FunctionComponent<SubSchemaItemProps> = ({
  dispatchSchemaUpdate,
  subSchema,
  subSchemaReference,
  workingSchemaDraft,
}) => {
  // @todo remove router usage from SchemaEditor (so it can be more easily used elsewhere)
  const router = useRouter();

  const subSchemaName = subSchema[0];

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    subSchemaUsedInProperties: [],
  });

  const { generateAbsoluteSchemaLink } = useContext(SchemaOptionsContext) ?? {};

  const SchemaLink = generateAbsoluteSchemaLink?.(`#/$defs/${subSchemaName}`);

  const updateAlertState = (newAlertState: Partial<AlertState>) => {
    setAlertState((oldAlertState) => ({
      ...oldAlertState,
      ...newAlertState,
    }));
  };

  const showAlert = (subSchemaUsedInProperties: Array<string>) => {
    setAlertState({ open: true, subSchemaUsedInProperties });
  };

  const clearAlert = () => {
    updateAlertState({
      open: false,
      subSchemaUsedInProperties: [],
    });
  };

  const continueDeletingSubSchemaItem = () => {
    dispatchSchemaUpdate({
      type: "deleteSubSchema",
      payload: { subSchemaName },
    });

    clearAlert();

    if (subSchemaReference?.split("/").pop() === subSchemaName) {
      return router.push(workingSchemaDraft.$id ?? "#");
    }
  };

  const deleteSubschemaItem = (subSchemaNameToDelete: string) => {
    const dependentProperties = getSubschemaDependentProperties(
      workingSchemaDraft,
      subSchemaNameToDelete,
    );

    if (dependentProperties.length > 0) {
      return showAlert(
        dependentProperties.map((property) => {
          // Join path to property using arrows
          if (Array.isArray(property)) {
            return property.join(" 🡒 ");
          }

          // Return propertyname directly
          return property;
        }),
      );
    }

    return continueDeletingSubSchemaItem();
  };

  return (
    <div className={tw`mb-4`} key={subSchemaName}>
      {SchemaLink}
      <Button
        onClick={() => deleteSubschemaItem(subSchemaName)}
        color="warning"
      >
        Delete Subschema
      </Button>
      <ConfirmationAlert
        title={`Are you sure you want to delete ${subSchemaName}?`}
        open={alertState.open}
        onClose={clearAlert}
        onContinue={continueDeletingSubSchemaItem}
      >
        <p>
          The expected type for these properties would change to{" "}
          <code>string</code>
        </p>

        <p>
          <ul>
            {alertState.subSchemaUsedInProperties.map((propertyName) => (
              <li key={propertyName}>• {propertyName}</li>
            ))}
          </ul>
        </p>
      </ConfirmationAlert>
    </div>
  );
};

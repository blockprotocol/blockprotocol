import { FunctionComponent, useContext } from "react";

import { JsonSchema } from "../../../lib/json-schema.js";
import { Button } from "../../button.js";
import { TextInputOrDisplay, ToggleInputOrDisplay } from "./inputs.js";
import { SchemaOptionsContext } from "./schema-editor.js";
import { SchemaEditorDispatcher } from "./schema-editor-reducer.js";
import { tdClasses, trClasses } from "./schema-properties-table.js";
import { SchemaPropertyTypeList } from "./schema-property-type-list.js";

type SchemaPropertyRowProps = {
  dispatchSchemaUpdate: SchemaEditorDispatcher;
  name: string;
  property: JsonSchema;
  readonly: boolean;
  required: boolean;
};

export const SchemaPropertyRow: FunctionComponent<SchemaPropertyRowProps> = ({
  dispatchSchemaUpdate,
  name,
  property,
  readonly,
  required,
}) => {
  const { selectedSchema } = useContext(SchemaOptionsContext) ?? {};

  const isArray = property.type === "array";

  const togglePropertyIsArray = () =>
    dispatchSchemaUpdate({
      type: "togglePropertyIsArray",
      payload: { propertyName: name },
    });

  const togglePropertyIsRequired = () =>
    dispatchSchemaUpdate({
      type: "togglePropertyIsRequired",
      payload: { propertyName: name },
    });

  const updatePropertyDescription = (newDescription: string) =>
    dispatchSchemaUpdate({
      type: "updatePropertyDescription",
      payload: { propertyName: name, newPropertyDescription: newDescription },
    });

  const updatePropertySchemaOrgLink = (newSchemaOrgUri: string) =>
    dispatchSchemaUpdate({
      type: "updatePropertySchemaOrgLink",
      payload: { propertyName: name, newSchemaOrgUri },
    });

  const updatePropertyName = (newName: string) =>
    dispatchSchemaUpdate({
      type: "updatePropertyName",
      payload: { oldPropertyName: name, newPropertyName: newName },
    });

  const updatePermittedType = (newType: string) =>
    dispatchSchemaUpdate({
      type: "updatePropertyPermittedType",
      payload: { newType, propertyName: name },
    });

  const deleteProperty = () =>
    dispatchSchemaUpdate({
      type: "deleteProperty",
      payload: { propertyName: name },
    });

  /**
   * @todo deal with tuples and other array keywords, e.g. preferredItems
   */
  const { $ref, type, properties } = isArray
    ? (property.items as JsonSchema)
    : property;

  const { description } = property;

  const schemaOrgLink = selectedSchema?.["jsonld:context"]?.[
    "jsonld:definition"
  ].find((def) => def["jsonld:term"] === name)?.["jsonld:iri"];

  return (
    <tr className={trClasses}>
      <td className={tdClasses}>
        <TextInputOrDisplay
          placeholder="The property name"
          readonly={readonly}
          updateText={updatePropertyName}
          value={name}
          updateOnBlur
        />
      </td>
      <td className={tdClasses}>
        <SchemaPropertyTypeList
          hasSubSchema={!!properties}
          propertyName={name}
          readonly={readonly}
          $ref={$ref}
          type={type}
          updatePermittedType={updatePermittedType}
        />
      </td>
      <td className={tdClasses}>
        <TextInputOrDisplay
          placeholder="Describe the property..."
          readonly={readonly}
          updateText={updatePropertyDescription}
          value={description ?? ""}
          updateOnBlur
        />
      </td>
      <td className={tdClasses}>
        <TextInputOrDisplay
          placeholder="URI to schema.org equivalent property"
          readonly={readonly}
          updateText={updatePropertySchemaOrgLink}
          value={schemaOrgLink ?? ""}
          updateOnBlur
        />
      </td>
      <td className={tdClasses}>
        <ToggleInputOrDisplay
          checked={isArray}
          onChange={() => togglePropertyIsArray()}
          readonly={readonly}
        />
      </td>
      <td className={tdClasses}>
        <ToggleInputOrDisplay
          checked={required}
          onChange={() => togglePropertyIsRequired()}
          readonly={readonly}
        />
      </td>
      {!readonly && (
        <td className={tdClasses}>
          <Button
            onClick={deleteProperty}
            color="danger"
            variant="secondary"
            squared
          >
            Delete
          </Button>
        </td>
      )}
    </tr>
  );
};

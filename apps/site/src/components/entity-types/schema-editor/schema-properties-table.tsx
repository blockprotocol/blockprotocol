import { FormEvent, FunctionComponent, useState } from "react";
import { tw } from "twind";

import { JsonSchema } from "../../../lib/json-schema";
import { Button } from "../../button";
import { TextInputOrDisplay } from "./inputs";
import { SchemaEditorDispatcher } from "./schema-editor-reducer";
import { SchemaPropertyRow } from "./schema-property-row";

type SchemaPropertiesTableProps = {
  dispatchSchemaUpdate: SchemaEditorDispatcher;
  readonly: boolean;
  selectedSchema: JsonSchema;
};

const cellPadding = "pl-4 pr-8 py-4";

const thClasses = tw`sticky first:rounded-tl-2xl last:rounded-tr-2xl ${cellPadding}`;
export const trClasses = tw`border border-gray-100 rounded-2xl odd:bg-gray-50 even:bg-gray-100`;
export const tdClasses = tw`${cellPadding}`;

export const SchemaPropertiesTable: FunctionComponent<
  SchemaPropertiesTableProps
> = ({ readonly, selectedSchema, dispatchSchemaUpdate }) => {
  const { properties, required } = selectedSchema;
  const requiredArray = required instanceof Array ? required : undefined;

  const addProperty = (newPropertyName: string) =>
    dispatchSchemaUpdate({
      type: "addProperty",
      payload: { newPropertyName },
    });

  const [newPropertyName, setNewPropertyName] = useState("");

  const onAddPropertyFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newPropertyName.trim()) {
      return false;
    }

    addProperty(newPropertyName);
    setNewPropertyName("");
  };

  return (
    <table
      className={tw`max-w-full w-full text-sm text-left border-separate border border-gray-100 rounded-2xl`}
      style={{ borderSpacing: 0 }}
      data-testid="schema-properties-table"
    >
      <thead>
        <tr>
          <th className={thClasses}>Property</th>
          <th className={thClasses}>Expected Type</th>
          <th className={thClasses}>Description</th>
          <th className={thClasses}>schema.org equivalent</th>
          <th className={thClasses}>Array</th>
          <th className={thClasses}>Required</th>
          {!readonly && <th className={thClasses}>Delete</th>}
        </tr>
      </thead>
      <tbody>
        {Object.entries((properties ?? {}) as Record<string, JsonSchema>)
          ?.sort((a, b) => a[0].localeCompare(b[0]))
          .map(([name, propertySchema]) => {
            const isRequired =
              requiredArray?.includes(name) || !!propertySchema.required;
            return (
              <SchemaPropertyRow
                dispatchSchemaUpdate={dispatchSchemaUpdate}
                key={name}
                name={name}
                property={propertySchema}
                readonly={readonly}
                required={isRequired}
              />
            );
          })}
        {!readonly ? (
          <tr className={trClasses}>
            <td className={tdClasses} colSpan={7}>
              <div className={tw`font-bold mt-4 mr-12 mb-1`}>New property</div>
              <form onSubmit={onAddPropertyFormSubmit} className={tw`flex`}>
                <TextInputOrDisplay
                  placeholder="newProperty"
                  readonly={false}
                  updateText={setNewPropertyName}
                  value={newPropertyName}
                  required
                />
                <br />
                <Button
                  className={tw`ml-4`}
                  type="submit"
                  variant="primary"
                  squared
                >
                  Create Property
                </Button>
              </form>
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
};

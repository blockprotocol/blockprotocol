import { MenuItem } from "@mui/material";
import Select from "@mui/material/Select";
import { FunctionComponent, ReactNode, useContext, useMemo } from "react";
import { tw } from "twind";

import { JsonSchema } from "../../../lib/json-schema";
import { SchemaOptionsContext } from "./schema-editor";

const primitiveJsonTypes = [
  "boolean",
  "integer",
  "number",
  "null",
  "string",
] as const;

type SchemaPropertyTypeListProps = {
  hasSubSchema: boolean;
  propertyName: string;
  readonly: boolean;
  type?: JsonSchema["type"];
  $ref?: JsonSchema["$ref"];
  updatePermittedType?: (newType: string) => void; // @todo support selecting multiple types
};

const PropertyTypeDisplay: FunctionComponent<
  Omit<SchemaPropertyTypeListProps, "readonly" | "updatePermittedType">
> = ({ $ref, hasSubSchema, propertyName, type }) => {
  const { generateAbsoluteSchemaLink } = useContext(SchemaOptionsContext) ?? {};

  if (!generateAbsoluteSchemaLink) {
    return null;
  }

  const SchemaLink = generateAbsoluteSchemaLink?.($ref ?? propertyName);

  if ($ref) {
    return SchemaLink;
  }

  return (
    <>
      {(Array.isArray(type) ? type : [type])
        .map<ReactNode>((permittedType) =>
          permittedType === "object" && hasSubSchema ? (
            SchemaLink
          ) : (
            <span key={permittedType}>{permittedType}</span>
          ),
        )
        .reduce((prev, curr) => [prev, ", ", curr])}
    </>
  );
};

const PropertyTypeSelect: FunctionComponent<
  Omit<
    SchemaPropertyTypeListProps,
    "hasSubSchema" | "GoToSchemaElement" | "propertyName" | "readonly"
  >
> = ({ $ref, type, updatePermittedType }) => {
  const { availableEntityTypes, subSchemas } =
    useContext(SchemaOptionsContext) ?? {};

  const currentType = $ref ?? (Array.isArray(type) ? type[0] : type); // @todo support multiple permitted types

  const typeOptions = useMemo(() => {
    const options = [
      {
        disabled: true,
        label: "----- Primitive types -----",
        value: "__primitive_divider",
      },
      ...primitiveJsonTypes.map((primitiveType) => ({
        disabled: false,
        label: primitiveType,
        value: primitiveType,
      })),
    ];
    if (subSchemas?.length) {
      options.push(
        {
          disabled: true,
          label: "----- Sub-schemas -----",
          value: "__subschema_divider",
        },
        ...subSchemas.map((subSchema) => ({
          disabled: false,
          label: subSchema[0],
          value: `#/$defs/${subSchema[0]}`,
        })),
      );
    }
    if (availableEntityTypes?.length) {
      options.push(
        {
          disabled: true,
          label: "---- Other entities ----",
          value: "__other_type_divider",
        },
        ...availableEntityTypes.map((entityType) => ({
          disabled: false,
          label: entityType.schema.title,
          value: entityType.schema.$id,
        })),
      );
    }
    return options;
  }, [availableEntityTypes, subSchemas]);

  return (
    <Select
      className={tw`w-32`}
      onChange={(evt) => updatePermittedType?.(evt.target.value)}
      value={currentType}
    >
      {typeOptions.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export const SchemaPropertyTypeList: FunctionComponent<
  SchemaPropertyTypeListProps
> = ({ readonly, ...props }) => {
  if (!readonly) {
    return <PropertyTypeSelect {...props} />;
  }

  return <PropertyTypeDisplay {...props} />;
};

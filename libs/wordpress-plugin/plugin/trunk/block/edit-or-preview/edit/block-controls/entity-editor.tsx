import "./bootstrap.scss";

import { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { JsonObject } from "@blockprotocol/core";
import Form from "@rjsf/core";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { useEffect, useRef, useState } from "react";

import { CONTROLS_LOADING_IMAGE_HEIGHT } from "../block-controls";
import { LoadingImage } from "../loading-image";
import { fetchSchema } from "./fetch-schema";

type EntityEditorProps = {
  entityProperties: JsonObject;
  entityTypeId: string;
  updateProperties: (properties: JsonObject) => void;
};

const uiSchema: UiSchema = {
  "ui:submitButtonOptions": {
    norender: true,
  },
};

const EntityEditor = ({
  entityProperties,
  entityTypeId,
  updateProperties,
}: EntityEditorProps) => {
  const formRef = useRef<Form | null>(null);

  const [schema, setSchema] = useState<JSONSchema | null>(null);

  useEffect(() => {
    void fetchSchema(entityTypeId).then((resp) => setSchema(resp));
  }, [entityTypeId]);

  const onSubmit = () => {
    if (!formRef.current) {
      return;
    }
    updateProperties(formRef.current.state.formData);
  };

  if (!schema) {
    return <LoadingImage height={CONTROLS_LOADING_IMAGE_HEIGHT} />;
  }

  return (
    <div className="block-protocol-entity-editor">
      <Form
        formData={entityProperties}
        onBlur={onSubmit}
        ref={formRef}
        schema={schema as RJSFSchema}
        uiSchema={uiSchema}
        validator={validator}
      />
    </div>
  );
};

export default EntityEditor;

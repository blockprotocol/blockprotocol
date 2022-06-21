import {
  ServiceDefinition,
  ServiceMessageDefinition,
} from "@blockprotocol/core";
import { Box, Typography } from "@mui/material";
import * as React from "react";
import slugify from "slugify";

import { JsonSchema } from "../lib/json-schema";
import { mdxComponents } from "../util/mdx-components";

const DataType: React.VoidFunctionComponent<{ propertySchema: JsonSchema }> = ({
  propertySchema,
}) => {
  const MdxA = mdxComponents.a!;

  const isArray = propertySchema.type === "array";
  const { type: innerType, $ref } = isArray
    ? (propertySchema.items as JsonSchema)
    : propertySchema;

  return $ref ? (
    <MdxA href={$ref} target="_blank">
      {$ref.match(/[^/]+(?=\/$|$)/)?.[0]}
      {isArray ? "[]" : ""}
    </MdxA>
  ) : (
    <>
      {innerType}
      {isArray ? "[]" : ""}
    </>
  );
};

const ServiceMessageData: React.VoidFunctionComponent<{
  data: ServiceMessageDefinition["data"];
}> = ({ data }) => {
  const MdxCode = mdxComponents.code!;
  const MdxTable = mdxComponents.table!;

  const { type } = data;

  if (type === "object") {
    return (
      <>
        <MdxCode>object</MdxCode>
        <MdxTable>
          <thead>
            <tr>
              <th>property</th>
              <th>type</th>
              <th>required</th>
              <th>description</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.properties as Record<string, JsonSchema>).map(
              ([propertyName, propertySchema]) => (
                <tr key={propertyName}>
                  <td>
                    <Typography variant="bpSmallCopy">
                      <MdxCode>{propertyName}</MdxCode>
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="bpMicroCopy">
                      <DataType propertySchema={propertySchema} />
                    </Typography>
                  </td>
                  <td>
                    {((data.required as string[]) ?? []).includes(
                      propertyName,
                    ) ? (
                      <Typography
                        variant="bpMicroCopy"
                        sx={{ fontWeight: 700 }}
                      >
                        yes
                      </Typography>
                    ) : (
                      <Typography variant="bpMicroCopy">no</Typography>
                    )}
                  </td>
                  <td>
                    <Typography variant="bpMicroCopy">
                      {propertySchema.description}
                    </Typography>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </MdxTable>
      </>
    );
  }
  return (
    <MdxCode>
      <DataType propertySchema={data} />
    </MdxCode>
  );
};

const ServiceMessage: React.VoidFunctionComponent<{
  message: ServiceMessageDefinition;
}> = ({ message }) => {
  const MdxCode = mdxComponents.code!;
  const MdxLi = mdxComponents.li!;
  const MdxUl = mdxComponents.ul!;
  const MdxH5 = mdxComponents.h5!;
  const MdxA = mdxComponents.a!;

  const {
    data,
    description,
    errorCodes,
    messageName,
    respondedToBy,
    sentOnInitialization,
    source,
  } = message;

  return (
    <Box sx={{ mb: 4 }}>
      <MdxH5>
        <MdxCode>{messageName}</MdxCode>
      </MdxH5>
      <Typography sx={{ mb: 1, mt: 1 }} variant="bpSmallCopy" component="div">
        {description}
      </Typography>
      <MdxUl>
        <MdxLi>
          <MdxCode>source</MdxCode>:{" "}
          <Typography variant="bpSmallCopy" sx={{ fontWeight: 600 }}>
            {source}
          </Typography>
        </MdxLi>
        <MdxLi>
          <MdxCode>data</MdxCode>: <ServiceMessageData data={data} />
        </MdxLi>
        <MdxLi>
          <MdxCode>errorCodes</MdxCode>:{" "}
          <Typography variant="bpSmallCopy" sx={{ fontWeight: 600 }}>
            {errorCodes && errorCodes.length > 0
              ? errorCodes.map((code, index) => (
                  <>
                    {index > 0 ? ", " : ""}
                    <MdxCode key={code}>{code}</MdxCode>
                  </>
                ))
              : "none"}
          </Typography>
        </MdxLi>
        <MdxLi>
          <MdxCode>respondedToBy</MdxCode>:{" "}
          <Typography variant="bpSmallCopy" sx={{ fontWeight: 600 }}>
            {respondedToBy ? (
              <MdxA href={`#${slugify(respondedToBy, { lower: true })}`}>
                {respondedToBy}
              </MdxA>
            ) : (
              "none"
            )}
          </Typography>
        </MdxLi>
        <MdxLi>
          <MdxCode>sentOnInitialization</MdxCode>:{" "}
          <MdxCode>
            {sentOnInitialization ? <strong>true</strong> : "false"}
          </MdxCode>
        </MdxLi>
      </MdxUl>
    </Box>
  );
};

export const ServiceMessageList: React.VoidFunctionComponent<{
  serviceDefinition: ServiceDefinition;
}> = ({ serviceDefinition }) => {
  return (
    <Box>
      {serviceDefinition.messages.map((message) => (
        <ServiceMessage key={message.messageName} message={message} />
      ))}
    </Box>
  );
};

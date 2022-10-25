import {
  ServiceDefinition,
  ServiceMessageDefinition,
} from "@blockprotocol/core";
import { Box, Typography } from "@mui/material";
import { Fragment, FunctionComponent } from "react";

import { JsonSchema } from "../lib/json-schema.js";
import { Link } from "./link.jsx";
import { mdxComponents } from "./mdx/mdx-components.jsx";

const DataType: FunctionComponent<{ propertySchema: JsonSchema }> = ({
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
      {Array.isArray(innerType) ? innerType.join(" | ") : innerType}
      {isArray ? "[]" : ""}
    </>
  );
};

const ServiceMessageData: FunctionComponent<{
  data: ServiceMessageDefinition["data"];
}> = ({ data }) => {
  const MdxCode = mdxComponents.code!;
  const MdxTable = mdxComponents.table!;

  const { type } = data;

  if (type === "object") {
    return (
      <>
        <MdxCode>object</MdxCode>
        <MdxTable width="100%">
          <thead>
            <tr>
              <th style={{ width: "150px" }}>property</th>
              <th>type</th>
              <th style={{ maxWidth: "110px" }}>required</th>
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
                  <td style={{ maxWidth: "110px" }}>
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

const generateServiceMessageAnchor = (messageName: string) =>
  `message:${messageName}`;

const ServiceMessage: FunctionComponent<{
  message: ServiceMessageDefinition;
}> = ({ message }) => {
  const MdxCode = mdxComponents.code!;
  const MdxLi = mdxComponents.li!;
  const MdxUl = mdxComponents.ul!;
  const MdxH5 = mdxComponents.h5!;

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
    <Box sx={{ mb: 4 }} id={generateServiceMessageAnchor(messageName)}>
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
          <Typography variant="bpSmallCopy">
            {errorCodes && errorCodes.length > 0
              ? errorCodes.map((code, index) => (
                  <Fragment key={code}>
                    {index > 0 ? ", " : ""}
                    <MdxCode>{code}</MdxCode>
                  </Fragment>
                ))
              : "none"}
          </Typography>
        </MdxLi>
        <MdxLi>
          <MdxCode>respondedToBy</MdxCode>:{" "}
          <Typography
            variant="bpSmallCopy"
            sx={{ fontWeight: respondedToBy ? 600 : 400 }}
          >
            {respondedToBy ?? "none"}
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

export const ServiceMessageList: FunctionComponent<{
  serviceDefinition: ServiceDefinition;
}> = ({ serviceDefinition }) => {
  return (
    <Box>
      <Box>
        {serviceDefinition.messages.map(({ messageName, source }) => (
          <Typography key={messageName} mb={1}>
            <Link
              href={`#${generateServiceMessageAnchor(messageName)}`}
              sx={{ fontWeight: 600 }}
            >
              {messageName}
            </Link>
            <Typography component="span" variant="bpSmallCopy" ml={1}>
              [{source}]
            </Typography>
          </Typography>
        ))}
      </Box>
      {serviceDefinition.messages.map((message) => (
        <ServiceMessage key={message.messageName} message={message} />
      ))}
    </Box>
  );
};

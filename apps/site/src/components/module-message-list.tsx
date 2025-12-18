import {
  JsonObject,
  ModuleDefinition,
  ModuleMessageDefinition,
} from "@blockprotocol/core";
import { Box, Typography } from "@mui/material";
import { Fragment, FunctionComponent } from "react";

import { Link } from "./link";
import { mdxComponents } from "./mdx/mdx-components";

const DataType: FunctionComponent<{ propertySchema: JsonObject }> = ({
  propertySchema,
}) => {
  const MdxA = mdxComponents.a!;

  const isArray = propertySchema.type === "array";
  const { type: innerType, $ref } = isArray
    ? (propertySchema.items as JsonObject)
    : propertySchema;

  return typeof $ref === "string" ? (
    <MdxA href={$ref} target="_blank">
      {/* Take the last part of the path which isn't versioning information */}
      {$ref.split("/").slice(...($ref.match(/\/v\/\d$/) ? [-3, -2] : [-1]))}
      {isArray ? "[]" : ""}
    </MdxA>
  ) : (
    <>
      {Array.isArray(innerType) ? innerType.join(" | ") : innerType}
      {isArray ? "[]" : ""}
    </>
  );
};

const ModuleMessageData: FunctionComponent<{
  data: ModuleMessageDefinition["data"];
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
            {Object.entries(data.properties ?? {}).map(
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
                  <td style={{ wordBreak: "break-word" }}>
                    <Typography variant="bpMicroCopy">
                      {typeof (propertySchema as { description?: string })
                        .description === "string"
                        ? (propertySchema as { description?: string })
                            .description
                        : ""}
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

const generateModuleMessageAnchor = (messageName: string) =>
  `message:${messageName}`;

const ModuleMessage: FunctionComponent<{
  message: ModuleMessageDefinition;
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
    <Box sx={{ mb: 4 }} id={generateModuleMessageAnchor(messageName)}>
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
          <MdxCode>data</MdxCode>: <ModuleMessageData data={data} />
        </MdxLi>
        <MdxLi>
          <MdxCode>errorCodes</MdxCode>:{" "}
          <Typography variant="bpSmallCopy">
            {errorCodes && errorCodes.length > 0
              ? errorCodes.map((code: string, index: number) => (
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

export const ModuleMessageList: FunctionComponent<{
  moduleDefinition: ModuleDefinition;
}> = ({ moduleDefinition }) => {
  return (
    <Box>
      <Box>
        {moduleDefinition.messages.map(
          ({
            messageName,
            source,
          }: {
            messageName: string;
            source: string;
          }) => (
            <Typography key={messageName} mb={1}>
              <Link
                href={`#${generateModuleMessageAnchor(messageName)}`}
                sx={{ fontWeight: 600 }}
              >
                {messageName}
              </Link>
              <Typography component="span" variant="bpSmallCopy" ml={1}>
                [{source}]
              </Typography>
            </Typography>
          ),
        )}
      </Box>
      {moduleDefinition.messages.map((message: { messageName: string }) => (
        <ModuleMessage key={message.messageName} message={message} />
      ))}
    </Box>
  );
};

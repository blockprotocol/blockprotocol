import React from "react";
import ReactJson from "react-json-view";

export const JsonView = ({
  collapseKeys,
  rootName,
  src,
}: {
  collapseKeys: string[];
  rootName: string;
  src: Record<string, unknown>;
}) => (
  <div
    style={{
      backgroundColor: "rgb(17, 17, 17)",
      padding: 15,
      border: "1px dashed black",
    }}
  >
    <ReactJson
      shouldCollapse={({ name }) => !!name && collapseKeys.includes(name)}
      name={rootName}
      src={src}
      theme="colors"
    />
  </div>
);

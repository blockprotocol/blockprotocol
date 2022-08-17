import ReactJson from "react-json-view";

export const JsonView = ({
  collapseKeys,
  rootName,
  src,
  ...props
}: {
  collapseKeys: string[];
  rootName: string;
  src: Record<string, unknown> | object;
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
      {...props}
    />
  </div>
);

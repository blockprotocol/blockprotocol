import { MarkButton } from "./mark-button";

export const Toolbar = () => {
  return (
    <div
      contentEditable={false}
      style={{
        padding: "8px 12px",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        userSelect: "none", // @see https://github.com/ianstormtaylor/slate/issues/3421#issuecomment-573326794
      }}
    >
      <MarkButton format="bold">
        <span>B</span>
      </MarkButton>
      <MarkButton format="italic">
        <span style={{ fontStyle: "italic" }}>I</span>
      </MarkButton>
      <MarkButton format="underline">
        <span style={{ textDecoration: "underline" }}>U</span>
      </MarkButton>
    </div>
  );
};

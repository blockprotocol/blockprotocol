import { MarkButton } from "./mark-button";

export const Toolbar = () => {
  return (
    <div
      style={{ padding: "8px 12px", borderBottom: "1px solid rgba(0,0,0,0.1)" }}
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

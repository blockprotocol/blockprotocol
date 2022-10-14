import { ReactElement } from "react";
import { useSlate } from "slate-react";

import { Format, isMarkActive, toggleMark } from "./shared";

export const MarkButton = ({
  children,
  format,
}: {
  children: ReactElement;
  format: Format;
}) => {
  const editor = useSlate();

  return (
    <button
      onClick={() => {
        toggleMark(editor, format);
      }}
      style={{
        opacity: isMarkActive(editor, format) ? 1 : 0.4,
        fontWeight: 600,
        width: 30,
        height: 25,
        fontSize: "1rem",
      }}
      type="button"
    >
      {children}
    </button>
  );
};

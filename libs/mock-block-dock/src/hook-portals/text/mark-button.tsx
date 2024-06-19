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
      onMouseDown={(event) =>
        // don't take focus from editor
        event.preventDefault()
      }
      style={{
        color: isMarkActive(editor, format) ? "dodgerblue" : "gray",
        fontWeight: 600,
        opacity: 1,
        width: 30,
        height: 25,
        fontSize: "1rem",
        background: "white",
      }}
      type="button"
    >
      {children}
    </button>
  );
};

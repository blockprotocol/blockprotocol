import { ReactElement, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Editor, Range } from "slate";
import { useFocused, useSlate } from "slate-react";

import { MarkButton } from "./mark-button";

const Portal = ({ children }: { children: ReactElement }) => {
  return createPortal(children, document.body);
};

// @see https://github.com/ianstormtaylor/slate/blob/main/site/examples/hovering-toolbar.tsx
export const Toolbar = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.style.visibility = "hidden";
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection) {
      return;
    }

    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.visibility = "visible";
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`;
  });

  return (
    <Portal>
      <div
        contentEditable={false}
        ref={ref}
        style={{
          position: "absolute",
          fontWeight: 600,
          zIndex: 1,
          marginTop: "-6px",
          visibility: "hidden",
          borderRadius: 4,
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
    </Portal>
  );
};

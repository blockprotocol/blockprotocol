import {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BaseEditor,
  createEditor,
  Descendant,
  Editor,
  Node,
  Transforms,
} from "slate";
import {
  Editable,
  ReactEditor,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";

import { debounce } from "../util";
import { Leaf } from "./text/leaf";
import { Format, MaybePlainOrRichText, toggleMark } from "./text/shared";
import { Toolbar } from "./text/toolbar";

type CustomText = { text: string } & { [key in Format]?: boolean };
type CustomElement = { type: "paragraph"; children: CustomText[] };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

/**
 * Update the internal state of the Slate editor with new nodes
 */
const resetNodes = (editor: Editor, nodes: Node[]) => {
  const children = [...(editor.children ?? [])];

  if (JSON.stringify(children) === JSON.stringify(nodes)) {
    return;
  }

  children.forEach((node) =>
    editor.apply({ type: "remove_node", path: [0], node }),
  );

  nodes.forEach((node, i) =>
    editor.apply({ type: "insert_node", path: [i], node }),
  );

  const point = Editor.end(editor, []);

  Transforms.select(editor, point);
};

type TextHookViewProps = {
  readonly?: boolean;
  text?: unknown;
  updateText: (text: Descendant[]) => void;
};

const isMaybeText = (value: unknown): value is MaybePlainOrRichText => {
  if (typeof value === "string" || value == null) {
    return true;
  }

  return (
    Array.isArray(value) &&
    (!value[0] || ("type" in value[0] && "children" in value[0]))
  );
};

const generateComparableString = (text: MaybePlainOrRichText) =>
  typeof text === "string" ? text : JSON.stringify(text);

export const TextHookView = ({
  readonly = false,
  text = "",
  updateText,
}: TextHookViewProps) => {
  const [editor] = useState(() => withReact(createEditor()));

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [],
  );

  if (!isMaybeText(text)) {
    throw new Error(
      `Expected text to be plain string, rich text, or nullish, got value: ${text}`,
    );
  }

  const previousTextRef = useRef<string | null>(null);
  if (previousTextRef.current === null) {
    previousTextRef.current = generateComparableString(text)
  }

  const nodesFromProps: Descendant[] = useMemo(
    () =>
      typeof text === "string" || text == null
        ? [
            {
              type: "paragraph",
              children: [{ text: text ?? "" }],
            },
          ]
        : text,
    [text],
  );

  useEffect(() => {
   const comparableString = generateComparableString(text);
    if (comparableString !== previousTextRef.current) {
      previousTextRef.current = comparableString;
      resetNodes(editor, nodesFromProps);
    }
  }, [editor, nodesFromProps, text]);

  const onKeyDown = useCallback<KeyboardEventHandler>(
    (event) => {
      if (!event.metaKey) {
        return;
      }
      if (!["b", "u", "i"].includes(event.key)) {
        return;
      }

      event.preventDefault();
      switch (event.key) {
        case "b":
          toggleMark(editor, "bold");
          break;
        case "i":
          toggleMark(editor, "italic");
          break;
        case "u":
          toggleMark(editor, "underline");
          break;
      }
    },
    [editor],
  );

  const onChange = debounce((value: Descendant[]) => {
    updateText(value);
  }, 200);

  return (
    <div style={{ border: "1px solid rgba(0,0,0,0.5)" }}>
      <Slate editor={editor} onChange={onChange} value={nodesFromProps}>
        <Toolbar />
        <Editable
          style={{ padding: "12px" }}
          onKeyDown={onKeyDown}
          placeholder="Enter some rich text…"
          readOnly={readonly}
          renderLeaf={renderLeaf}
        />
      </Slate>
    </div>
  );
};

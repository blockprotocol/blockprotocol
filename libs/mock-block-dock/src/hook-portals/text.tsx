import {
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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

const serializeToPlaintext = (nodes: Descendant[]) => {
  return nodes.map((node) => Node.string(node)).join("\n");
};

const generateComparableString = (text: MaybePlainOrRichText) =>
  typeof text === "string" ? text : serializeToPlaintext(text ?? []);

/**
 * Compare two texts to see if they differ either
 * - in plain text (if at least one is a string), or
 * - in text and/or formatting (if both are rich text)
 */
const isTextDifferent = (
  first: MaybePlainOrRichText,
  second: MaybePlainOrRichText,
) => {
  if (typeof first === "string") {
    return first !== generateComparableString(second);
  }
  if (typeof second === "string") {
    return second !== serializeToPlaintext(first ?? []);
  }
  // These are both rich text, so we don't convert them to plain text – we want to detect formatting differences
  return JSON.stringify(first) !== JSON.stringify(second);
};

export const TextHookView = ({
  readonly = false,
  text = "",
  updateText,
}: TextHookViewProps) => {
  const editor = useMemo(() => {
    return withReact(createEditor());
  }, []);

  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [],
  );

  if (!isMaybeText(text)) {
    throw new Error(
      `Expected text to be plain string, rich text, or nullish, got value: ${text}`,
    );
  }

  const previousTextRef = useRef<MaybePlainOrRichText>(null);
  if (previousTextRef.current === null) {
    previousTextRef.current = text;
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
    if (isTextDifferent(text, previousTextRef.current)) {
      previousTextRef.current = text;
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
    <div style={{ position: "relative" }}>
      {/* @ts-expect-error –– library needs updating for React 19? */}
      <Slate
        editor={editor}
        onChange={(value) => {
          /**
           * This is not just an optimization – updating Editor content from props (via the resetNodes function)
           * also triggers onChange, and if external updates are coming quickly, this can cause a loop.
           */
          if (isTextDifferent(value, text)) {
            onChange(value);
          }
        }}
        value={nodesFromProps}
      >
        <Toolbar />
        {/* @ts-expect-error –– library needs updating for React 19? */}
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

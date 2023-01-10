import { Descendant, Editor } from "slate";

export type Format = "bold" | "italic" | "underline";

export type MaybePlainOrRichText = Descendant[] | string | undefined | null;

export const isMarkActive = (editor: Editor, format: Format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor: Editor, format: Format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

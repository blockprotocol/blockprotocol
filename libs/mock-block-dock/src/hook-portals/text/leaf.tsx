import { HTMLAttributes, ReactElement } from "react";
import { Text } from "slate";

type LeafProps = {
  children: ReactElement;
  attributes: HTMLAttributes<HTMLSpanElement> & { "data-slate-leaf": true }; // needed for compatibility with RenderLeafProps#attributes from `slate-react`
  leaf: Text;
};

export const Leaf = ({ attributes, children, leaf }: LeafProps) => {
  let formattedChildren = children;
  if (leaf.bold) {
    formattedChildren = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    formattedChildren = <em>{formattedChildren}</em>;
  }

  if (leaf.underline) {
    formattedChildren = <u>{formattedChildren}</u>;
  }

  return <span {...attributes}>{formattedChildren}</span>;
};

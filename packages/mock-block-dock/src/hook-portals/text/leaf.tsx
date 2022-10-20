import { HTMLAttributes, ReactElement } from "react";
import { Text } from "slate";

type LeafProps = {
  children: ReactElement;
  attributes: HTMLAttributes<HTMLSpanElement>;
  leaf: Text;
};

export const Leaf = ({ attributes, children, leaf }: LeafProps) => {
  let formattedChildren = children;
  if (leaf.bold) {
    formattedChildren = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    formattedChildren = <em>{children}</em>;
  }

  if (leaf.underline) {
    formattedChildren = <u>{children}</u>;
  }

  return <span {...attributes}>{formattedChildren}</span>;
};

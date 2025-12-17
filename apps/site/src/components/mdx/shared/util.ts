import { ReactNode } from "react";

export const stringifyChildren = (node: ReactNode): string => {
  if (typeof node === "string") {
    return node;
  } else if (Array.isArray(node)) {
    return node.map(stringifyChildren).join("");
  } else if (!!node && typeof node === "object" && "props" in node) {
    return stringifyChildren(
      (node.props as { children?: ReactNode }).children,
    );
  }
  return "";
};
